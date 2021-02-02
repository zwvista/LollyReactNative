import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { DrawerActions, NavigationContainer, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HomeScreen, NotificationsScreen } from './screens/Search'
import { Inject, Module } from 'react.di';
import { WordsUnitService } from './view-models/words-unit.service';
import { AppService } from './view-models/app.service';
import { UserSettingService } from './services/misc/user-setting.service';
import { DictionaryService } from './services/misc/dictionary.service';
import { TextbookService } from './services/misc/textbook.service';
import { HtmlService } from './services/misc/html.service';
import { PhrasesUnitService } from './view-models/phrases-unit.service';
import { UnitPhraseService } from './services/wpp/unit-phrase.service';
import { LanguageService } from './services/misc/language.service';
import { UnitWordService } from './services/wpp/unit-word.service';
import { SettingsService } from './view-models/settings.service';
import { AutoCorrectService } from './services/misc/autocorrect.service';
import { LangPhraseService } from './services/wpp/lang-phrase.service';
import { LangWordService } from './services/wpp/lang-word.service';
import { WordsLangService } from './view-models/words-lang.service';
import { PhrasesLangService } from './view-models/phrases-lang.service';
import { NoteService } from './view-models/note.service';
import { VoicesService } from './services/misc/voices.service';
import { WordFamiService } from './services/wpp/word-fami.service';
import { WordsFamiService } from './view-models/words-fami.service';
import { UsMappingService } from './services/misc/us-mapping.service';
import { PatternService } from './services/wpp/pattern.service';
import { PatternsService } from './view-models/patterns.service';

// https://stackoverflow.com/questions/60316864/react-navigation-drawer-v5
// https://stackoverflow.com/questions/60233339/react-native-hamburger-onpress-issue

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerComponent = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} options={{drawerIcon: () => <Ionicons name='md-home' size={30} color='#130f40' />}}/>
      <Drawer.Screen name="Notifications" component={NotificationsScreen} options={{drawerIcon: () => <Ionicons name='md-notifications' size={30} color='#130f40' />}}/>
    </Drawer.Navigator>
  );
};

@Module({
  providers: [
    DictionaryService, HtmlService, LanguageService,
    TextbookService, UnitPhraseService, UnitWordService, UserSettingService, AppService,
    PhrasesUnitService, SettingsService, WordsUnitService, AutoCorrectService,
    LangPhraseService, LangWordService, PhrasesLangService, WordsLangService,
    NoteService, WordFamiService, WordsFamiService,
    VoicesService, UsMappingService, PatternService, PatternsService
  ],
})
export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{
              title: 'My home',
              headerStyle: {
                backgroundColor: '#5f27cd',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerLeft: () => {
                const navigation = useNavigation();
                return (
                  <Ionicons name='md-menu' style={{paddingLeft: "4%"}} size={30} color='white' onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
                );
              }
            }}
            component={DrawerComponent}
            name="Drawer"
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};
