import {StatusBar} from 'expo-status-bar';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from "react";
import RNBluetoothClassic, {BluetoothDevice, StandardOptions} from 'react-native-bluetooth-classic';
import {getBluetoothDevices, requestBluetoothPermissions} from "./services/BluetoothLEService";
import BluetoothData from "./components/BluetoothData";

export default function App() {

    const [bluetoothDevices, setBluetoothDevices] = useState<BluetoothDevice[]>([]);
    const [bluetoothDeviceSelected, setBluetoothDeviceSelected] = useState<BluetoothDevice>();
    const [bluetoothPermissions, setBluetoothPermissions] = useState<boolean>(false);
    const [bluetoothData, setBluetoothData] = useState<string>("");

    requestBluetoothPermissions().then(permission => setBluetoothPermissions(permission));

    const listBluetoothDevices = () => {
        console.log("listBluetoothDevices")

        let bluetoothDevicesFound: BluetoothDevice[] = [];
        getBluetoothDevices()
            .then((devices: BluetoothDevice[]) => {
                devices.map((device: BluetoothDevice) => {
                    bluetoothDevicesFound.push(device)
                })
            })
            .then(() => {
                setBluetoothDevices(bluetoothDevicesFound);
            });
    }

    const handleBluetoothDeviceSelection = async (device: BluetoothDevice) => {
        const properties: StandardOptions = {delimiter: '\r'};
        try {
            console.log("Trying to accept connection to " + device.name);
            device = await RNBluetoothClassic.accept(properties);
            if (device) {
                setBluetoothDeviceSelected(device);
            }
        } catch (error) {
            // If we're not in an accepting state, then chances are we actually
            // requested the cancellation. This could be managed on the native
            // side but for now this gives more options.
            console.error('Attempt to accept connection failed: ' + JSON.stringify(error));
        }
    }

    type DeviceProps = {
        name: string,
        onPress: () => void
    };
    const DeviceItem = (deviceProps: DeviceProps) => (
        <TouchableOpacity onPress={deviceProps.onPress}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>{deviceProps.name}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                testID={'bluetoothDevicesList'}
                data={bluetoothDevices}
                renderItem={({item}) => <DeviceItem name={item.name}
                                                    onPress={() => handleBluetoothDeviceSelection(item)}/>}
                keyExtractor={(device: BluetoothDevice) => device.id}
                ListEmptyComponent={() => <Text>Aucun appareil Bluetooth détecter</Text>}
            />
            {!bluetoothPermissions ? <Text>Permissions Bluetooth non accordées</Text> : null}
            {bluetoothDeviceSelected ?
                <>
                    <Text style={styles.buttonText}>Appareil sélectionné : {bluetoothDeviceSelected.name}</Text>
                    <BluetoothData bluetoothDeviceSelected={bluetoothDeviceSelected}
                                   bluetoothData={bluetoothData}
                                   setBluetoothData={setBluetoothData}/>
                </> : null
            }
            <TouchableOpacity
                onPress={listBluetoothDevices}
                testID={'listBluetoothDevices'}
                style={styles.button}>
                <Text style={styles.buttonText}>
                    Détecter les appareils Bluetooth
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
