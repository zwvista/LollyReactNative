/**
 * @format
 */

import {AppRegistry} from 'react-native';
import { AppBootstrapper } from 'react-native-modular-bootstrapper';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => AppBootstrapper.startup(App));
