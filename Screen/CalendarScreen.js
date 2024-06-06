import React, { useEffect, useState } from 'react';
import { View, Text, SectionList, StyleSheet } from 'react-native';
import axios from 'axios';

const CalendarScreen = () => {
  const [holidays, setHolidays] = useState([]);
  const currentYear = new Date().getFullYear();
  const yearsToFetch = [currentYear, currentYear, currentYear - 1]; // Add more years as needed

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const responses = await Promise.all(
          yearsToFetch.map(year =>
            axios.get('https://calendarific.com/api/v2/holidays', {
              params: {
                api_key: 'ckA8ZmICqhOjfB7t02f4SCUJUF4s5pxB', // Replace with your actual API key
                country: 'MY',           // Change 'US' to 'MY' for Malaysia
                year: year,
              },
            })
          )
        );

        const allHolidays = responses.flatMap(response => response.data.response.holidays);
        console.log(allHolidays); // Log the API response to inspect the structure
        setHolidays(allHolidays);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHolidays();
  }, []);

  const groupedHolidays = holidays.reduce((acc, holiday) => {
    const year = new Date(holiday.date.iso).getFullYear();
    const month = new Date(holiday.date.iso).toLocaleString('default', { month: 'long' });

    const key = `${year}-${month}`;

    if (!acc[key]) {
      acc[key] = { title: `${month} ${year}`, data: [] };
    }

    acc[key].data.push(holiday);

    return acc;
  }, {});

  const sections = Object.values(groupedHolidays).sort((a, b) => {
    const [aYear, aMonth] = a.title.split(' ');
    const [bYear, bMonth] = b.title.split(' ');

    if (aYear === bYear) {
      return new Date(`${aMonth} 1, 2000`).getMonth() - new Date(`${bMonth} 1, 2000}`).getMonth();
    }
    return aYear - bYear;
  });

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item.date.iso}-${index}`} // Ensure unique keys
        renderItem={({ item }) => (
          <View style={styles.holidayItem}>
            <Text style={styles.holidayDate}>{item.date.iso}</Text>
            <Text style={styles.holidayName}>{item.name}</Text>
            <Text style={styles.holidayState}>
              {Array.isArray(item.states) && item.states.length > 0
                ? item.states.map(state => state.name).join(', ')
                : 'National Holiday'}
            </Text>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    fontSize: 24, // Increased font size
    fontWeight: 'bold',
    backgroundColor: '#f9f9f9',
    padding: 16, // Increased padding
    marginTop: 16,
  },
  holidayItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  holidayDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  holidayName: {
    fontSize: 18,
    marginTop: 4,
  },
  holidayState: {
    fontSize: 14,
    marginTop: 4,
    color: '#666',
  },
});

export default CalendarScreen;
