"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PendingActivity;
var _react = _interopRequireWildcard(require("react"));
var _antd = require("antd");
var _componentMessageBus = require("@ivoyant/component-message-bus");
var _Header = _interopRequireDefault(require("./Header"));
var _ActivityTable = _interopRequireDefault(require("./ActivityTable"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function PendingActivity(_ref) {
  let {
    data,
    properties,
    parentProps
  } = _ref;
  const [totalPendingActivities, setTotalPendingActivities] = (0, _react.useState)(0);
  const [pendingActivities, setPendingActivities] = (0, _react.useState)(false);
  const [pendingActivitiesCopy, setPendingActivitiesCopy] = (0, _react.useState)(false);
  const [error, setError] = (0, _react.useState)(false);
  const {
    workflow,
    datasource,
    successStates,
    errorStates,
    responseMapping
  } = properties.workflow;
  const {
    searchPlaceHolder,
    processingMessage,
    errorCancelActivity,
    cancelOptionsStatus
  } = properties;
  (0, _react.useEffect)(() => {
    getPendingActivities();
    return () => {
      _componentMessageBus.MessageBus.unsubscribe(workflow);
    };
  }, []);
  const filterBySubscriber = subscriberNumber => {
    let pendingCopy = pendingActivities?.slice().filter(record => {
      return record?.ctn.toString().includes(subscriberNumber?.toString());
    });
    setPendingActivitiesCopy(pendingCopy);
  };
  const handleResponse = (subscriptionId, topic, eventData, closure) => {
    const state = eventData.value;
    const isSuccess = successStates.includes(state);
    const isFailure = errorStates.includes(state);
    if (isSuccess || isFailure) {
      if (isSuccess) {
        setPendingActivities(eventData?.event?.data?.data || false);
        setPendingActivitiesCopy(eventData?.event?.data?.data || false);
        setTotalPendingActivities(eventData?.event?.data?.data?.length);
      }
      if (isFailure) {
        setError(eventData?.event?.data?.message || 'Error - Something went wrong, Please try again later!');
      }
      _componentMessageBus.MessageBus.unsubscribe(subscriptionId);
    }
  };
  function getPendingActivities() {
    const submitEvent = 'SUBMIT';
    _componentMessageBus.MessageBus.send('WF.'.concat(workflow).concat('.INIT'), {
      header: {
        registrationId: workflow,
        workflow,
        eventType: 'INIT'
      }
    });
    _componentMessageBus.MessageBus.subscribe(workflow, 'WF.'.concat(workflow).concat('.STATE.CHANGE'), handleResponse);
    _componentMessageBus.MessageBus.send('WF.'.concat(workflow).concat('.').concat(submitEvent), {
      header: {
        registrationId: workflow,
        workflow,
        eventType: submitEvent
      },
      body: {
        datasource: parentProps.datasources[datasource],
        request: {
          params: {
            ban: window[sessionStorage?.tabId].NEW_BAN
          }
        },
        responseMapping
      }
    });
  }
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_antd.Row, null, /*#__PURE__*/_react.default.createElement(_Header.default, {
    searchPlaceHolder: searchPlaceHolder,
    totalPendingActivities: totalPendingActivities,
    filterBySubscriber: filterBySubscriber
  }), /*#__PURE__*/_react.default.createElement(_ActivityTable.default, {
    pendingActivities: pendingActivitiesCopy,
    processingMessage: processingMessage,
    error: error,
    parentProps: parentProps,
    cancelActivityWorkflow: properties.cancelActivityWorkflow,
    getPendingActivities: getPendingActivities,
    errorCancelActivity: errorCancelActivity,
    cancelOptionsStatus: cancelOptionsStatus
  })));
}
module.exports = exports.default;