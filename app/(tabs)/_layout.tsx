import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Tabs } from "expo-router";
import React from "react";

export default function Layout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Entypo
                            name="home"
                            size={24}
                            color={focused ? "blue" : "black"}
                        />
                    ),
                    title: "Home",
                }}
            />
            <Tabs.Screen
                name="generate"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <FontAwesome6
                            name="qrcode"
                            size={24}
                            color={focused ? "blue" : "black"}
                        />
                    ),
                    title: "Generate QR",
                }}
            />
        </Tabs>
    );
}
