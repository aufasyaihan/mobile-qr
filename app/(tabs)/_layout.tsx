import { Tabs } from "expo-router";
import React from "react";

export default function Layout() {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ headerShown: false }} />
            <Tabs.Screen name="tracker" options={{ headerShown: false }} />
        </Tabs>
    );
}
