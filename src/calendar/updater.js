import {parseDate} from '../interface';

export default function shouldComponentUpdate(nextProps, nextState) {
  let shouldUpdate = (nextProps.selected || []).reduce(
    (prev, next, i) => {
      const currentSelected = (this.props.selected || [])[i];
      if (
        !currentSelected ||
        !next ||
        parseDate(currentSelected).getTime() !== parseDate(next).getTime()
      ) {
        return {
          update: true,
          field: 'selected',
        };
      }
      return prev;
    },
    {update: false},
  );

  shouldUpdate = ['markedDates', 'hideExtraDays'].reduce((prev, next) => {
    if (!prev.update && nextProps[next] !== this.props[next]) {
      return {
        update: true,
        field: next,
      };
    }
    return prev;
  }, shouldUpdate);

  shouldUpdate = ['minDate', 'maxDate', 'current'].reduce((prev, next) => {
    const prevDate = parseDate(this.props[next]);
    const nextDate = parseDate(nextProps[next]);
    if (prev.update) {
      return prev;
    } else if (prevDate !== nextDate) {
      if (prevDate && nextDate && prevDate.getTime() === nextDate.getTime()) {
        return prev;
      } else {
        return {
          update: true,
          field: next,
        };
      }
    }
    return prev;
  }, shouldUpdate);

  if (nextState.currentMonth !== this.state.currentMonth) {
    shouldUpdate = {
      update: true,
      field: 'current',
    };
  }
  if (nextState.currentMonth !== this.state.currentMonth) {
    shouldUpdate = {
      update: true,
      field: 'current',
    };
  }
  if (nextProps.initialPosition !== this.props.initialPosition) {
    shouldUpdate = {
      update: true,
      field: 'initialPosition',
    };
  }
  if (nextProps.disableLeftArrow !== this.props.disableLeftArrow) {
    shouldUpdate = {
      update: true,
      field: 'disableLeftArrow',
    };
  }
  if (nextProps.disableRightArrow !== this.props.disableRightArrow) {
    shouldUpdate = {
      update: true,
      field: 'disableRightArrow',
    };
  }
  if (nextProps.disabledByDefault !== this.props.disabledByDefault) {
    shouldUpdate = {
      update: true,
      field: 'disabledByDefault',
    };
  }
  //console.log(shouldUpdate.field, shouldUpdate.update);
  return shouldUpdate.update;
}
