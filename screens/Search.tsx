import * as React from 'react';
import { Button, View } from 'react-native';
import { container } from "tsyringe";
import { AppService } from "../view-models/misc/app.service.ts";

export function HomeScreen({ navigation }:any) {
  const appService = container.resolve(AppService);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => navigation.navigate('Notifications')}
        title={`Go to notifications ${appService.isInitialized}`}
      />
    </View>
  );
}

export function NotificationsScreen({ navigation }:any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}
