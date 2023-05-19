import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {requestPermissions, scanForBluetoothDevices} from "./services/BluetoothLEService";
import {useState} from "react";
import {Device} from "react-native-ble-plx";

export default function App() {

    const [bluetoothDevices, setBluetoothDevices] = useState<Device[]>([]);

    requestPermissions()
        .then(() => {
                console.log("Permissions Granted");
                scanForBluetoothDevices()
                    .then((devices) => {
                        console.log("Bluetooth devices available: ", devices);
                        setBluetoothDevices(devices);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        ).catch((error) => {
        console.error(error);
    });

    const connectToBluetoothDevice = () => {
        console.log("Connecting to bluetooth device...");
    }
    //
    // const DeviceItem = ({device}: Device) => (
    //     <View style={styles.device}>
    //         <Text style={styles.deviceName}>{device}</Text>
    //     </View>
    // );

    return (
        <View style={styles.container}>
            <Text>Open up App.tsx to start working on your app!</Text>
            {/*<FlatList data={bluetoothDevices} renderItem={({device}) => <DeviceItem device={device.title}/>}*/}
            {/*          keyExtractor={device: Device => device.id}/>*/}
            <TouchableOpacity
                onPress={connectToBluetoothDevice}
                style={styles.button}>
                <Text style={styles.buttonText}>
                    "Connect"
                </Text>
            </TouchableOpacity>
            <StatusBar style="auto"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: "#017E84",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        marginHorizontal: 20,
        marginBottom: 5,
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
});
