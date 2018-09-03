import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import muiTheme from '../../config/mui-custom-theme';
import AppBar from '../../components/Global/AppBar';
import NavBar from '../../components/Global/NavBar';

class App extends React.Component {

  render() {
    return (
      <MuiThemeProvider muiTheme={ muiTheme }>
        <div className='App'>
          <AppBar />
          <div className='content-wrapper'>
            { this.props.children }
          </div>
          <NavBar />
        </div>
      </MuiThemeProvider>
    );
  }
}

// const App = ({ children }) => (
//   <MuiThemeProvider muiTheme={ muiTheme }>
//     <div className='App'>
//       <AppBar />
//       <div className='content-wrapper'>
//         { children }
//       </div>
//       <NavBar />
//     </div>
//   </MuiThemeProvider>
// );

export default App;
