import { Viewer } from '@grapecity/activereports-react';
import { useEffect } from 'react';
import React, { useState } from 'react';
import jsreport from 'jsreport-browser-client-dist';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDispatches } from "../../redux/dispatch/dispatchSlice";

const RequestForm = () => {
    const dispatch = useDispatch();
    const dispatches = useSelector(state => state.dispatches.dispatches.results);
    const error = useSelector(state => state.dispatches.error);

    useEffect(() => {
        dispatch(fetchDispatches());
    }, [dispatch]);

    // const [reportData, setReportData] = useState(null);
    const generateReport = async () => {
        try {
        jsreport.serverUrl = 'http://localhost:4444';
        const response = await jsreport.render({
            template: {
            name: 'dispatch',
            // content: 'Hello from {{message}}',
            // engine: 'handlebars',
            // recipe: 'chrome-pdf'
            },
            data: {
            dataX: dispatches
            }
        });
        response.download('myreport.pdf');
        response.openInWindow({title: 'My Report'});
        // setReportData(response.data.toString('utf8'));
        } catch (error) {
        console.error('Error generating report:', error);
        }
    };
        
    return (
        <div>
            
        </div>
    );
};

export default RequestForm;