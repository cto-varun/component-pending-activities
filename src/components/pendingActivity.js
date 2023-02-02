import React, { useState, useEffect } from 'react';
import { Row } from 'antd';
import { MessageBus } from '@ivoyant/component-message-bus';
import TopHeader from './Header';
import ActivityTable from './ActivityTable';

export default function PendingActivity({ data, properties, parentProps }) {
    const [totalPendingActivities, setTotalPendingActivities] = useState(0);
    const [pendingActivities, setPendingActivities] = useState(false);
    const [pendingActivitiesCopy, setPendingActivitiesCopy] = useState(false);
    const [error, setError] = useState(false);
    const {
        workflow,
        datasource,
        successStates,
        errorStates,
        responseMapping,
    } = properties.workflow;

    const {
        searchPlaceHolder,
        processingMessage,
        errorCancelActivity,
        cancelOptionsStatus
    } = properties;

    useEffect(() => {
        getPendingActivities();
        return () => {
            MessageBus.unsubscribe(workflow);
        };
    }, []);
    const filterBySubscriber = (subscriberNumber) => {
        let pendingCopy = pendingActivities?.slice().filter((record) => {
            return record?.ctn
                .toString()
                .includes(subscriberNumber?.toString());
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
                setError(
                    eventData?.event?.data?.message ||
                        'Error - Something went wrong, Please try again later!'
                );
            }
            MessageBus.unsubscribe(subscriptionId);
        }
    };
    function getPendingActivities() {
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
                            ban: window[sessionStorage?.tabId].NEW_BAN,
                        },
                    },
                    responseMapping,
                },
            }
        );
    }
    return (
        <>
            <Row>
                <TopHeader
                    searchPlaceHolder={searchPlaceHolder}
                    totalPendingActivities={totalPendingActivities}
                    filterBySubscriber={filterBySubscriber}
                />
                <ActivityTable
                    pendingActivities={pendingActivitiesCopy}
                    processingMessage={processingMessage}
                    error={error}
                    parentProps={parentProps}
                    cancelActivityWorkflow={properties.cancelActivityWorkflow}
                    getPendingActivities={getPendingActivities}
                    errorCancelActivity={errorCancelActivity}
                    cancelOptionsStatus={cancelOptionsStatus}
                />
            </Row>
        </>
    );
}
