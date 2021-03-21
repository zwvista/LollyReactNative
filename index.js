/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Global } from "typedin";
import { AppService } from './view-models/app.service';

Global.register(AppService, new AppService());

AppRegistry.registerComponent(appName, () => App);
