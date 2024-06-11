import React, { useState } from 'react';
import jsreport from 'jsreport-browser-client-dist';
import { useSelector } from 'react-redux';

const DispatchReport = () => {
  const [reportData, setReportData] = useState(null);
  const dispatches = useSelector(state => state.dispatches.dispatches.results);
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
    <div id="reportContainer">
      {reportData && <div dangerouslySetInnerHTML={{ __html: reportData }} />}
      <button onClick={generateReport}>Generate Report</button>
    </div>
  );
};

export default DispatchReport;