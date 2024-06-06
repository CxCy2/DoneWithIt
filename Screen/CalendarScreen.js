import React, { useEffect, useState, useRef, memo } from 'react';
import { View, Text, SectionList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import a different icon library

const HolidayItem = memo(({ item, isBeforeCurrentMonth, getDayOfWeek, getHolidayLocation }) => (
  <View style={styles.holidayItem}>
    <Text style={[styles.holidayDate, isBeforeCurrentMonth(item.date.iso) && styles.greyText]}>
      {item.date.iso} ({getDayOfWeek(item.date.iso)})
    </Text>
    <Text style={[styles.holidayName, isBeforeCurrentMonth(item.date.iso) && styles.greyText]}>
      {item.name}
    </Text>
    <Text style={[styles.holidayState, isBeforeCurrentMonth(item.date.iso) && styles.greyText]}>
      {getHolidayLocation(item)}
    </Text>
  </View>
));

const CalendarScreen = () => {
  const [holidays, setHolidays] = useState([]);
  const sectionListRef = useRef(null);
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth(); // 0-based index for current month
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
        setHolidays(allHolidays);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHolidays();
  }, []);

  useEffect(() => {
    if (sectionListRef.current) {
      setTimeout(() => {
        const sectionIndex = sections.findIndex(section => section.title.includes(currentMonth) && section.title.includes(currentYear.toString()));
        if (sectionIndex >= 0) {
          sectionListRef.current.scrollToLocation({
            sectionIndex,
            itemIndex: 25,
            animated: true,
          });
        }
      }, 1000); // Adding a delay to ensure sections are rendered
    }
  }, [holidays]);

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
    const [aMonth, aYear] = a.title.split(' ');
    const [bMonth, bYear] = b.title.split(' ');

    if (aYear === bYear) {
      return new Date(`${aMonth} 1, 2000`).getMonth() - new Date(`${bMonth} 1, 2000}`).getMonth();
    }
    return aYear - bYear;
  });

  const getHolidayLocation = (holiday) => {
    if (Array.isArray(holiday.states) && holiday.states.length > 0) {
      return holiday.states.map(state => state.name).join(', ');
    }
    return 'National Holiday';
  };

  const renderSectionHeader = ({ section: { title } }) => {
    const isCurrentMonth = title.includes(currentMonth) && title.includes(currentYear.toString());
    return (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeader}>{title}</Text>
        {isCurrentMonth && (
          <View style={styles.currentMonthIndicator}>
            <Text style={styles.currentMonthText}>This Month</Text>
          </View>
        )}
      </View>
    );
  };

  const getDayOfWeek = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('default', { weekday: 'long' });
  };

  const isBeforeCurrentMonth = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    return year < currentYear || (year === currentYear && monthIndex < currentMonthIndex);
  };

  const scrollToCurrentMonth = () => {
    const sectionIndex = sections.findIndex(section => section.title.includes(currentMonth) && section.title.includes(currentYear.toString()));
    if (sectionIndex >= 0 && sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        sectionIndex,
        itemIndex: 25,
        animated: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderTitle}>Holiday</Text>
        <Text style={styles.subHeaderCategory}>Islam</Text>
        <Text style={styles.subHeaderCategory}>Buddhist</Text>
        <Text style={styles.subHeaderCategory}>Christian</Text>
        <Text style={styles.subHeaderCategory}>Hindu</Text>
        <TouchableOpacity onPress={scrollToCurrentMonth}>
          <Icon name="refresh" size={25} color="black" style={styles.refreshIcon} />
        </TouchableOpacity>
      </View>
      <SectionList
        ref={sectionListRef}
        sections={sections}
        keyExtractor={(item, index) => `${item.date.iso}-${index}`} // Ensure unique keys
        renderItem={({ item }) => (
          <HolidayItem 
            item={item}
            isBeforeCurrentMonth={isBeforeCurrentMonth}
            getDayOfWeek={getDayOfWeek}
            getHolidayLocation={getHolidayLocation}
          />
        )}
        renderSectionHeader={renderSectionHeader}
        getItemLayout={(data, index) => (
          { length: 80, offset: 80 * index, index }
        )}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            sectionListRef.current?.scrollToLocation({ sectionIndex: info.sectionIndex, itemIndex: info.index, animated: true });
          });
        }}
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
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 5, // Reduced padding
    paddingHorizontal: 5, // Reduced padding
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  subHeaderTitle: {
    fontSize: 12, // Reduced font size
    fontWeight: 'bold',
  },
  subHeaderCategory: {
    fontSize: 10, // Reduced font size
    marginHorizontal: 5, // Reduced margin
  },
  refreshIcon: {
    marginLeft: 'auto',
    marginRight: 5, // Reduced margin
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40, // Increased padding
    paddingBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sectionHeader: {
    fontSize: 24, // Increased font size
    fontWeight: 'bold',
  },
  currentMonthIndicator: {
    backgroundColor: 'green',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  currentMonthText: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  holidayItem: {
    marginBottom: 8, // Reduced margin
    borderBottomWidth: 1,
    borderBottomColor: '#ddd', // Add a bottom border to create a line effect
  },
  holidayDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
  holidayName: {
    fontSize: 18,
    marginTop: 4,
  },
  holidayState: {
    fontSize: 14,
    marginTop: 4,
    color: '#666',
    marginBottom: 16,
  },
  greyText: {
    color: 'grey',
  },
});

export default CalendarScreen;
