"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ActivityTable;
var _react = _interopRequireWildcard(require("react"));
var _antd = require("antd");
var _componentMessageBus = require("@ivoyant/component-message-bus");
var _icons = require("@ant-design/icons");
require("./PendingActivity.css");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ActivityTable(_ref) {
  let {
    pendingActivities,
    processingMessage,
    error,
    cancelActivityWorkflow,
    getPendingActivities,
    parentProps,
    errorCancelActivity,
    cancelOptionsStatus
  } = _ref;
  const [isCanceling, setIsCanceling] = (0, _react.useState)(false);
  const {
    workflow,
    datasource,
    successStates,
    errorStates,
    responseMapping
  } = cancelActivityWorkflow;
  const columns = [{
    title: 'ACTIVITY TYPE',
    dataIndex: 'activityCode',
    key: 'activityCode'
  }, {
    title: 'FUTURE DATED',
    dataIndex: 'futureActivityIndicator',
    key: 'futureActivityIndicator',
    render: dt => dt.toString()
  }, {
    title: 'ACTIVITY DATE',
    dataIndex: 'requestInitiationDate',
    key: 'requestInitiationDate'
  }, {
    title: 'SUBSCRIBER',
    dataIndex: 'ctn',
    key: 'ctn'
  }, {
    title: 'ACTIVITY STATUS',
    dataIndex: 'status',
    key: 'status'
  }, {
    title: 'ACTION',
    dataIndex: 'allowCancelActivity',
    key: 'allowCancelActivity',
    render: (data, record, index) => data || cancelOptionsStatus?.includes(record?.status?.toLowerCase()) ? /*#__PURE__*/_react.default.createElement(_antd.Button, {
      type: "text",
      icon: /*#__PURE__*/_react.default.createElement(_icons.CloseOutlined, null),
      loading: isCanceling === index,
      onClick: () => {
        cancelPendingActivity(record, index);
      }
    }, "Cancel") : ''
  }];
  const openNotificationWithIcon = _ref2 => {
    let {
      type,
      message,
      description
    } = _ref2;
    _antd.notification[type]({
      description
    });
  };
  const handleResponse = (subscriptionId, topic, eventData, closure) => {
    const state = eventData.value;
    const isSuccess = successStates.includes(state);
    const isFailure = errorStates.includes(state);
    if (isSuccess || isFailure) {
      setIsCanceling(false);
      if (isSuccess) {
        openNotificationWithIcon({
          type: 'success',
          description: 'Activity has been cancelled'
        });
        getPendingActivities();
      }
      if (isFailure) {
        openNotificationWithIcon({
          type: 'error',
          description: eventData?.event?.data?.message || errorCancelActivity
        });
        // setError(eventData?.event?.data?.message);
        // setEventData(eventData);
      }

      _componentMessageBus.MessageBus.unsubscribe(subscriptionId);
    }
  };
  function cancelPendingActivity(record, index) {
    setIsCanceling(index);
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
            ban: window[window.sessionStorage?.tabId].NEW_BAN,
            sequencenumber: record?.sequenceNumber
          }
        },
        responseMapping
      }
    });
  }
  return /*#__PURE__*/_react.default.createElement(_antd.Col, {
    span: 24
  }, pendingActivities ? /*#__PURE__*/_react.default.createElement(_antd.Table, {
    columns: columns
    // dataSource={usageDetailsResponse?.eventInfo || []}
    ,
    dataSource: pendingActivities || []
    // rowClassName="bg-transparent"
    ,
    className: "table_container",
    pagination: {
      showSizeChanger: true
    }
    // onChange={(currentPagination) => {
    //     setPagination({
    //         ...pagination,
    //         paginationInfo: {
    //             ...pagination?.paginationInfo,
    //             pageNumber: currentPagination.current
    //         }
    //     })
    // }}
  }) : /*#__PURE__*/_react.default.createElement(_antd.Col, {
    span: 24,
    className: "loader"
  }, error ? /*#__PURE__*/_react.default.createElement("div", null, error) : /*#__PURE__*/_react.default.createElement(_antd.Spin, null)));
}
module.exports = exports.default;