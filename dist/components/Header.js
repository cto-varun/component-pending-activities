"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TopHeader;
var _react = _interopRequireDefault(require("react"));
var _antd = require("antd");
var _icons = require("@ant-design/icons");
require("./PendingActivity.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function TopHeader(_ref) {
  let {
    totalPendingActivities,
    searchPlaceHolder,
    filterBySubscriber
  } = _ref;
  return /*#__PURE__*/_react.default.createElement(_antd.Col, {
    span: 24
  }, /*#__PURE__*/_react.default.createElement(_antd.Row, {
    className: "top_row_container"
  }, /*#__PURE__*/_react.default.createElement(_antd.Col, null, "Total pending activities : ", totalPendingActivities), /*#__PURE__*/_react.default.createElement(_antd.Col, null, /*#__PURE__*/_react.default.createElement(_antd.Input, {
    placeholder: searchPlaceHolder,
    prefix: /*#__PURE__*/_react.default.createElement(_icons.SearchOutlined, {
      style: {
        color: 'rgba(0, 0, 0, 0.45)'
      }
    }),
    onChange: e => filterBySubscriber(e.target.value)
  }))));
}
module.exports = exports.default;