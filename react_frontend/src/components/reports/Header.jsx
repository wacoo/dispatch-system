import './Header.css';
import Logo from '../../img/logo.png';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    PDFViewer,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    viewer: {
        width: '100%',
        height: '100vh', // Adjust height as needed
    },
    customPage: {
        width: '11.69in', // A4 landscape width in inches
        height: '8.27in', // A4 landscape height in inches
        display: 'flex',
        flexDirection: 'row', // Arrange content horizontally
        justifyContent: 'center', // Center content horizontally
        alignItems: 'center', // Center content vertically
    },
    section: {
        writingMode: 'horizontal-lr', // Set writing mode to vertical right-to-left
        textOrientation: 'sideways', // Set text orientation to sideways
        textAlign: 'center', // Center text horizontally
        margin: '0 20px', // Adjust margins as needed
        flexGrow: 1, // Ensure the text takes up full available height
    },
});

const tableData = [
    { id: 1, name: 'John Doe', age: 30 },
    { id: 2, name: 'Jane Smith', age: 25 },
    { id: 3, name: 'Bob Johnson', age: 40 },
  ];

  const TableRow = ({ id, name, age }) => (
    <View style={styles.section} key={id}>
      <Text style={[styles.cell, styles.header]}>ID</Text>
      <Text style={styles.cell}>{id}</Text>
      <Text style={[styles.cell, styles.header]}>Name</Text>
      <Text style={styles.cell}>{name}</Text>
      <Text style={[styles.cell, styles.header]}>Age</Text>
      <Text style={styles.cell}>{age}</Text>
    </View>
  );

const CustomPage = ({ children }) => (
    <Document>
        <Page size="A4" orientation="landscape" style={styles.customPage}>
            <View style={styles.section}>
                {children}
            </View>
        </Page>
    </Document>
);

const Header = () => {
    return (
        <PDFViewer style={styles.viewer}>
            <CustomPage>
            {tableData.map(row => (
                <TableRow key={row.id} {...row} />
            ))}
            </CustomPage>
        </PDFViewer>
    );
    
}

export default Header;