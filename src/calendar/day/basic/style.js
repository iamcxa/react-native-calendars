import {StyleSheet, Platform} from 'react-native';
import * as defaultStyle from '../../../style';

const STYLESHEET_ID = 'stylesheet.day.basic';

export default function styleConstructor(theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    base: {
      width: 48,
      height: 48,
      alignItems: 'center',
      ...appStyle.selectedDotStyle,
    },
    text: {
      marginTop: Platform.OS === 'android' ? 4 : 6,
      fontSize: appStyle.textDayFontSize,
      fontFamily: appStyle.textDayFontFamily,
      fontWeight: appStyle.textDayFontWeight,
      color: appStyle.dayTextColor,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      ...appStyle.textDayStyle,
    },
    alignedText: {
      marginTop: Platform.OS === 'android' ? 4 : 6,
    },
    selected: {
      backgroundColor: appStyle.selectedDayBackgroundColor,
      borderRadius: 16,
    },
    today: {
      backgroundColor: appStyle.todayBackgroundColor,
      borderRadius: 16,
    },
    todayText: {
      color: appStyle.todayTextColor,
    },
    selectedText: {
      color: appStyle.selectedDayTextColor,
    },
    disabledText: {
      color: appStyle.textDisabledColor,
    },
    dotTextColor: {
      color: appStyle.dotTextColor,
    },
    selectedDotTextColor: {
      color: appStyle.selectedDotTextColor,
    },
    dot: {
      width: 4,
      height: 4,
      marginTop: 1,
      borderRadius: 2,
      opacity: 0,
      ...appStyle.dotStyle,
    },
    dotText: {
      color: appStyle.selectedDayTextColor,
    },
    visibleDot: {
      opacity: 1,
      backgroundColor: appStyle.dotColor,
    },
    selectedDot: {
      backgroundColor: appStyle.selectedDotColor,
    },
    selectedDotText: {
      color: appStyle.selectedDayTextColor,
    },
    disabledDot: {
      backgroundColor: appStyle.disabledDotColor || appStyle.dotColor,
    },
    todayDot: {
      backgroundColor: appStyle.todayDotColor || appStyle.dotColor,
    },
    ...(theme[STYLESHEET_ID] || {}),
  });
}
