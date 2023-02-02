import React from 'react';
import {
    Row,
    Col,
    Input
} from 'antd';
import {
    SearchOutlined
} from '@ant-design/icons';
import './PendingActivity.css';

export default function TopHeader({ totalPendingActivities, searchPlaceHolder, filterBySubscriber }) {
    return (
        <Col span={24}>
            <Row className="top_row_container">
                <Col>
                    Total pending activities : {totalPendingActivities}
                </Col>
                <Col>
                    <Input
                        placeholder={searchPlaceHolder}
                        prefix={
                            <SearchOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
                        }
                        onChange={(e) => filterBySubscriber(e.target.value)}
                    />
                </Col>
            </Row>
        </Col>
    );
}