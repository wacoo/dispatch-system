import { Typography } from "@mui/material"

const Error403 = () => {
    return (
      <>
        <Typography variant="h2" component="h1">
        Error 403: Forbidden
      </Typography>
      <Typography variant="h3" component="h2">
        <p>ይህን ገጽ ለማየት ፍቃድ አልተሰጦትም!</p>
        <p>You don't have access to this page!</p>
      </Typography>
      </>
      
      
    );
  };
  
  export default Error403;