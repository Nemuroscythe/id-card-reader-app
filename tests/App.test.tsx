import {BluetoothDevice, BluetoothNativeDevice, BluetoothNativeModule} from "react-native-bluetooth-classic";
import BluetoothModule from "react-native-bluetooth-classic/lib/BluetoothModule";
import {fireEvent, render} from "@testing-library/react-native";
import App from "../App";
import * as BluetoothLEService from "../services/BluetoothLEService";


describe('Bluetooth Device Tests', () => {

    let bondedBluetoothDevice: BluetoothDevice;
    let bluetoothDevice: BluetoothDevice;

    beforeEach(() => {
        const bluetoothNativeModule: BluetoothNativeModule = {} as BluetoothNativeModule;
        const bluetoothModule: BluetoothModule = new BluetoothModule(bluetoothNativeModule);
        const bondedBluetoothNativeDevice: BluetoothNativeDevice = {
            name: "Bonded Device",
            address: "bonded address",
            id: "bonded Id",
            bonded: true,
            deviceClass: "bonded device class",
            rssi: 312,
            extra: new Map<string, Object>()
        };
        const bluetoothNativeDevice: BluetoothNativeDevice = {
            name: "Device",
            address: "Address",
            id: "Id",
            bonded: false,
            deviceClass: "Device class",
            rssi: 312,
            extra: new Map<string, Object>()
        };

        bondedBluetoothDevice = new BluetoothDevice(
            bondedBluetoothNativeDevice,
            bluetoothModule);
        bluetoothDevice = new BluetoothDevice(
            bluetoothNativeDevice,
            bluetoothModule);
    });

    test('Test listing of Bluetooth Devices', () => {
        const expectedBluetoothDevices: BluetoothDevice[] = [
            bondedBluetoothDevice,
            bluetoothDevice
        ];

        const getBluetoothDevicesSpy = jest
            .spyOn(BluetoothLEService, 'getBluetoothDevices')
            .mockResolvedValue(expectedBluetoothDevices);
        const homePage = render(<App/>);

        const bluetoothDeviceList = homePage.getByTestId('bluetoothDevicesList');
        const scanBluetoothDevicesButton = homePage.getByTestId('listBluetoothDevices');

        fireEvent.press(scanBluetoothDevicesButton);

        expect(getBluetoothDevicesSpy).toHaveBeenCalled();
    });

    afterEach(() => {
        jest.resetAllMocks()
        jest.restoreAllMocks()
    });
});
