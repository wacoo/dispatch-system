import jsreport from 'jsreport-browser-client-dist'

export const generateReport = async (name, data) => {
    try {
        console.log(data);
    // jsreport.serverUrl = 'http://localhost:4444';
    jsreport.serverUrl = 'http://192.168.5.6:4444';
    const response = await jsreport.render({
        template: {
        name: name,
        // content: 'Hello from {{message}}',
        // engine: 'handlebars',
        // recipe: 'chrome-pdf'
        },
        data: {
            cdispatch: data
        }
    });
    response.download('myreport.pdf');
    response.openInWindow({title: 'My Report'});
    // setReportData(response.data.toString('utf8'));
    } catch (error) {
        console.error('Error generating report:', error);
    }
};