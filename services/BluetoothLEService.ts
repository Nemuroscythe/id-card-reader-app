import {PermissionsAndroid, Platform} from "react-native";
import * as ExpoDevice from "expo-device";
import {BleError, BleManager, Device} from "react-native-ble-plx";

export async function requestPermissions() {
    if (Platform.OS === "android") {
        if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Location Permission",
                    message: "Bluetooth Low Energy requires Location",
                    buttonPositive: "OK",
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
            const isAndroid31PermissionsGranted =
                await requestAndroid31Permissions();

            return isAndroid31PermissionsGranted;
        }
    } else {
        return true;
    }
}

export async function scanForBluetoothDevices() {
    const allDevices: Device[] = [];

    let bleManager = new BleManager;
    bleManager.startDeviceScan(null, null, (error: BleError | null, device: Device | null) => {
        if (error) {
            console.log(error);
        }
        if (device) {
            allDevices.push(device);
        }
    })
    return allDevices;
}

const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        {
            title: "Scan Permission",
            message: "Bluetooth Low Energy requires Scan",
            buttonPositive: "OK",
        }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        {
            title: "Connection Permission",
            message: "Bluetooth Low Energy requires Connection",
            buttonPositive: "OK",
        }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
        }
    );

    return (
        bluetoothScanPermission === "granted" &&
        bluetoothConnectPermission === "granted" &&
        fineLocationPermission === "granted"
    );
};