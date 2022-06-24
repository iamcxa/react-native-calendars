import React, {Component} from 'react';
import {ActivityIndicator} from 'react-native';
import {TouchableOpacity as TouchableOpacityAndroid} from 'react-native-gesture-handler';
import {View, Text, Image, TouchableOpacity, Platform} from 'react-native';
import XDate from 'xdate';
import PropTypes from 'prop-types';
import styleConstructor from './style';
import {weekDayNames} from '../../dateutils';
import {CHANGE_MONTH_LEFT_ARROW, CHANGE_MONTH_RIGHT_ARROW} from '../../testIDs';

const withPreventDoublePress = (WrappedComponent) => {
  const APPEND_DISABLED_TIME = 250;
  const PREPEND_DISABLED_TIME = 750;

  class PreventDoublePress extends React.PureComponent {
    state = {
      onPressDisabled: false,
    };

    originalOnPress = (cb) => {
      setTimeout(() => {
        this.props.onPress && this.props.onPress();

        cb && cb();
      }, APPEND_DISABLED_TIME);
    };

    onPress = () => {
      if (this.state.onPressDisabled) return;

      const funcAfterOnPressTriggered = () =>
        setTimeout(
          () => this.setState({onPressDisabled: false}),
          PREPEND_DISABLED_TIME,
        );

      const funcAfterStateUpdated = () =>
        this.originalOnPress(funcAfterOnPressTriggered);

      this.setState({onPressDisabled: true}, funcAfterStateUpdated);
    };

    render() {
      const disabled = this.state.onPressDisabled || this.props.disabled;

      return (
        <WrappedComponent
          {...this.props}
          disabled={disabled}
          onPress={this.onPress}
          style={{
            ...this.props.style,
            opacity: disabled ? 0.2 : 1,
          }}
        />
      );
    }
  }

  PreventDoublePress.displayName = `withPreventDoublePress(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;
  return PreventDoublePress;
};

const Button = withPreventDoublePress(TouchableOpacity);

class CalendarHeader extends Component {
  static displayName = 'IGNORE';

  static propTypes = {
    titleText: PropTypes.string,
    theme: PropTypes.object,
    hideArrows: PropTypes.bool,
    month: PropTypes.instanceOf(XDate),
    addMonth: PropTypes.func,
    showIndicator: PropTypes.bool,
    firstDay: PropTypes.number,
    renderArrow: PropTypes.func,
    hideDayNames: PropTypes.bool,
    weekNumbers: PropTypes.bool,
    onPressArrowLeft: PropTypes.func,
    onPressArrowRight: PropTypes.func,
    disableLeftArrow: PropTypes.bool,
    disableRightArrow: PropTypes.bool,
  };

  static defaultProps = {
    monthFormat: 'MMMM yyyy',
    disableLeftArrow: false,
    disableRightArrow: false,
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.addMonth = this.addMonth.bind(this);
    this.substractMonth = this.substractMonth.bind(this);
    this.onPressLeft = this.onPressLeft.bind(this);
    this.onPressRight = this.onPressRight.bind(this);
  }

  addMonth() {
    this.props.addMonth(1);
  }

  substractMonth() {
    this.props.addMonth(-1);
  }

  shouldComponentUpdate(nextProps) {
    if (
      nextProps.month.toString('yyyy MM') !==
      this.props.month.toString('yyyy MM')
    ) {
      return true;
    }
    if (nextProps.showIndicator !== this.props.showIndicator) {
      return true;
    }
    if (nextProps.hideDayNames !== this.props.hideDayNames) {
      return true;
    }
    if (nextProps.firstDay !== this.props.firstDay) {
      return true;
    }
    if (nextProps.weekNumbers !== this.props.weekNumbers) {
      return true;
    }
    if (nextProps.monthFormat !== this.props.monthFormat) {
      return true;
    }
    if (nextProps.titleText !== this.props.titleText) {
      return true;
    }
    return false;
  }

  onPressLeft() {
    const {onPressArrowLeft} = this.props;
    if (typeof onPressArrowLeft === 'function') {
      return onPressArrowLeft(this.substractMonth, this.props.month);
    }
    return this.substractMonth();
  }

  onPressRight() {
    const {onPressArrowRight} = this.props;
    if (typeof onPressArrowRight === 'function') {
      return onPressArrowRight(this.addMonth, this.props.month);
    }
    return this.addMonth();
  }

  render() {
    let leftArrow = <View />;
    let rightArrow = <View />;
    let weekDaysNames = weekDayNames(this.props.firstDay);
    const {testID} = this.props;

    if (!this.props.hideArrows) {
      leftArrow = (
        <Button
          onPress={this.onPressLeft}
          style={this.style.arrow}
          hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
          testID={
            testID
              ? `${CHANGE_MONTH_LEFT_ARROW}-${testID}`
              : CHANGE_MONTH_LEFT_ARROW
          }
          disabled={this.props.disableLeftArrow}>
          {this.props.renderArrow ? (
            this.props.renderArrow('left')
          ) : (
            <Image
              source={require('../img/previous.png')}
              style={this.style.arrowImage}
            />
          )}
        </Button>
      );
      rightArrow = (
        <Button
          onPress={this.onPressRight}
          style={this.style.arrow}
          hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
          testID={
            testID
              ? `${CHANGE_MONTH_RIGHT_ARROW}-${testID}`
              : CHANGE_MONTH_RIGHT_ARROW
          }
          disabled={this.props.disableRightArrow}>
          {this.props.renderArrow ? (
            this.props.renderArrow('right')
          ) : (
            <Image
              source={require('../img/next.png')}
              style={this.style.arrowImage}
            />
          )}
        </Button>
      );
    }

    let indicator;
    if (this.props.showIndicator) {
      indicator = (
        <ActivityIndicator
          color={this.props.theme && this.props.theme.indicatorColor}
        />
      );
    }

    return (
      <View style={[this.props.style, {zIndex: 900000}]}>
        <View style={this.style.header}>
          {leftArrow}
          <View style={{flexDirection: 'row'}}>
            <Text
              allowFontScaling={false}
              style={this.style.monthText}
              accessibilityTraits="header">
              {this.props.titleText ||
                this.props.month.toString(this.props.monthFormat)}
            </Text>
            {indicator}
          </View>
          {rightArrow}
        </View>
        {!this.props.hideDayNames && (
          <View style={this.style.week}>
            {this.props.weekNumbers && (
              <Text
                allowFontScaling={false}
                style={this.style.dayHeader}></Text>
            )}
            {weekDaysNames.map((day, idx) => (
              <Text
                allowFontScaling={false}
                key={idx}
                accessible={false}
                style={this.style.dayHeader}
                numberOfLines={1}
                importantForAccessibility="no">
                {day}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  }
}

export default CalendarHeader;
