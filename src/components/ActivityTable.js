import React, { useState } from 'react';
import { Col, Table, Spin, Button, notification } from 'antd';
import { MessageBus } from '@ivoyant/component-message-bus';
import { CloseOutlined } from '@ant-design/icons';
import './PendingActivity.css';

export default function ActivityTable({
    pendingActivities,
    processingMessage,
    error,
    cancelActivityWorkflow,
    getPendingActivities,
    parentProps,
    errorCancelActivity,
    cancelOptionsStatus,
}) {
    const [isCanceling, setIsCanceling] = useState(false);
    const {
        workflow,
        datasource,
        successStates,
        errorStates,
        responseMapping,
    } = cancelActivityWorkflow;

    const columns = [
        {
            title: 'ACTIVITY TYPE',
            dataIndex: 'activityCode',
            key: 'activityCode',
        },
        {
            title: 'FUTURE DATED',
            dataIndex: 'futureActivityIndicator',
            key: 'futureActivityIndicator',
            render: (dt) => dt.toString(),
        },
        {
            title: 'ACTIVITY DATE',
            dataIndex: 'requestInitiationDate',
            key: 'requestInitiationDate',
        },
        {
            title: 'SUBSCRIBER',
            dataIndex: 'ctn',
            key: 'ctn',
        },
        {
            title: 'ACTIVITY STATUS',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'ACTION',
            dataIndex: 'allowCancelActivity',
            key: 'allowCancelActivity',
            render: (data, record, index) =>
                data ||
                cancelOptionsStatus?.includes(record?.status?.toLowerCase()) ? (
                    <Button
                        type="text"
                        icon={<CloseOutlined />}
                        loading={isCanceling === index}
                        onClick={() => {
                            cancelPendingActivity(record, index);
                        }}
                    >
                        Cancel
                    </Button>
                ) : (
                    ''
                ),
        },
    ];

    const openNotificationWithIcon = ({ type, message, description }) => {
        notification[type]({
            description,
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
                    description: 'Activity has been cancelled',
                });
                getPendingActivities();
            }
            if (isFailure) {
                openNotificationWithIcon({
                    type: 'error',
                    description:
                        eventData?.event?.data?.message || errorCancelActivity,
                });
                // setError(eventData?.event?.data?.message);
                // setEventData(eventData);
            }

            MessageBus.unsubscribe(subscriptionId);
        }
    };
    function cancelPendingActivity(record, index) {
        setIsCanceling(index);
        const submitEvent = 'SUBMIT';
        MessageBus.send('WF.'.concat(workflow).concat('.INIT'), {
            header: {
                registrationId: workflow,
                workflow,
                eventType: 'INIT',
            },
        });
        MessageBus.subscribe(
            workflow,
            'WF.'.concat(workflow).concat('.STATE.CHANGE'),
            handleResponse
        );
        MessageBus.send(
            'WF.'.concat(workflow).concat('.').concat(submitEvent),
            {
                header: {
                    registrationId: workflow,
                    workflow,
                    eventType: submitEvent,
                },
                body: {
                    datasource: parentProps.datasources[datasource],
                    request: {
                        params: {
                            ban: window[window.sessionStorage?.tabId].NEW_BAN,
                            sequencenumber: record?.sequenceNumber,
                        },
                    },
                    responseMapping,
                },
            }
        );
    }
    return (
        <Col span={24}>
            {pendingActivities ? (
                <Table
                    columns={columns}
                    // dataSource={usageDetailsResponse?.eventInfo || []}
                    dataSource={pendingActivities || []}
                    // rowClassName="bg-transparent"
                    className="table_container"
                    pagination={{
                        showSizeChanger: true,
                    }}
                    // onChange={(currentPagination) => {
                    //     setPagination({
                    //         ...pagination,
                    //         paginationInfo: {
                    //             ...pagination?.paginationInfo,
                    //             pageNumber: currentPagination.current
                    //         }
                    //     })
                    // }}
                />
            ) : (
                <Col span={24} className="loader">
                    {error ? <div>{error}</div> : <Spin />}
                </Col>
            )}
        </Col>
    );
}
