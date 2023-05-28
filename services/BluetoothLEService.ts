import {PermissionsAndroid, Platform} from "react-native";
import * as ExpoDevice from "expo-device";
import RNBluetoothClassic, {BluetoothDevice} from "react-native-bluetooth-classic";

export async function requestBluetoothPermissions() {
    if (Platform.OS === "android") {
        if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Location Permission",
                    message: "Bluetooth requires Location",
                    buttonPositive: "OK",
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
            return await requestAndroid31Permissions();
        }
    } else {
        return true;
    }
}

export async function getBluetoothDevices(): Promise<BluetoothDevice[]> {
    let bluetoothDevices: BluetoothDevice[] = [];
    if (Platform.OS === "android") {
        await scanBluetoothDevices()
            .then((devices: BluetoothDevice[]) => {
                devices.map((device: BluetoothDevice) => {
                    bluetoothDevices.push(device)
                })
            });
    }
    await getBondedDevices()
        .then((devices: BluetoothDevice[]) => {
            devices.map((device: BluetoothDevice) => {
                bluetoothDevices.push(device)
            })
        });
    return bluetoothDevices;
}

async function scanBluetoothDevices(): Promise<BluetoothDevice[]> {
    try {
        let devices: BluetoothDevice[] = [];

        let unpairedDevices: BluetoothDevice[] = await RNBluetoothClassic.startDiscovery();

        let index = devices.findIndex((bluetoothDevice: BluetoothDevice) => !bluetoothDevice.bonded);
        if (index >= 0) {
            devices.splice(index, devices.length - index, ...unpairedDevices);
        } else {
            devices.push(...unpairedDevices);
        }
        if (!devices) {
            console.log('No devices found');
            return [];
        }
        console.log(`Unpaired devices found: ${unpairedDevices.length}.`)
        return devices;
    } catch (error) {
        console.error(JSON.stringify(error));
        return [];
    }
}

async function getBondedDevices(): Promise<BluetoothDevice[]> {
    console.log('Getting bonded devices');
    try {
        let bonded = await RNBluetoothClassic.getBondedDevices();
        console.log(`Bonded devices found: ${bonded.length}.`);

        return bonded;
    } catch (error) {
        console.error(JSON.stringify(error));
        return [];
    }
}

const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        {
            title: "Scan Permission",
            message: "Bluetooth requires Scan",
            buttonPositive: "OK",
        }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        {
            title: "Connection Permission",
            message: "Bluetooth requires Connection",
            buttonPositive: "OK",
        }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
            title: "Location Permission",
            message: "Bluetooth requires Location",
            buttonPositive: "OK",
        }
    );

    return (
        bluetoothScanPermission === "granted" &&
        bluetoothConnectPermission === "granted" &&
        fineLocationPermission === "granted"
    );
};