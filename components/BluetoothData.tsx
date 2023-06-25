import {Text, TouchableOpacity, View} from "react-native";
import RNBluetoothClassic, {BluetoothDevice, BluetoothDeviceReadEvent} from "react-native-bluetooth-classic";
import React from "react";

type BluetoothDataProps = {
    bluetoothDeviceSelected: BluetoothDevice,
    bluetoothData: string,
    setBluetoothData: Function
}
export default function BluetoothData({bluetoothDeviceSelected, bluetoothData, setBluetoothData}: BluetoothDataProps) {

    const connectToBluetoothDevice = async () => {
        try {
            const connection = await bluetoothDeviceSelected.connect();
            if (connection) {
                console.log(`Connected to ${bluetoothDeviceSelected.name}`);
                initializeRead();
            } else {
                console.log(`Failed to connect to ${bluetoothDeviceSelected.name}`);
            }
        } catch (error) {
            console.error(JSON.stringify(error));
        }
    }


    function initializeRead() {
        const polling = true;
        RNBluetoothClassic.onDeviceDisconnected(() => disconnect(true));
        if (polling) {
            setInterval(() => performRead(), 5000);
        } else {
            bluetoothDeviceSelected.onDataReceived(data =>
                onReceivedData(data)
            );
        }
    }

    async function performRead() {
        try {
            console.log('Polling for available messages');
            let available = await bluetoothDeviceSelected.available();
            console.log(`There is data available [${available}], attempting read`);

            if (available > 0) {
                for (let i = 0; i < available; i++) {
                    console.log(`reading ${i}th time`);
                    let data = await bluetoothDeviceSelected.read();

                    console.log(`Read data ${data}`);
                    console.log(data);
                    const stringData = data.toString();
                    await onReceivedData({data: stringData} as BluetoothDeviceReadEvent);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Handles the ReadEvent by adding a timestamp and applying it to
     * list of received data.
     *
     * @param {ReadEvent} event
     */
    async function onReceivedData(event: BluetoothDeviceReadEvent) {
        setBluetoothData(event.data);
    }

    async function disconnect(disconnected: boolean,) {
        try {
            if (!disconnected) {
                disconnected = await bluetoothDeviceSelected.disconnect();
                console.warn(`Disconnected from ${bluetoothDeviceSelected.name}`);
            }
        } catch (error) {
            console.error(JSON.stringify(error));
        }
        // Clear the reads, so that they don't get duplicated
        // uninitializeRead();
    }

    /**
     * Clear the reading functionality.
     */
    // function uninitializeRead()
    // {
    //     if (readInterval) {
    //         clearInterval(this.readInterval);
    //     }
    //     if (this.readSubscription) {
    //         this.readSubscription.remove();
    //     }
    // }

    return <>
        <View>
            <Text>
                {bluetoothData ? bluetoothData : "Aucune donnée reçue"}
            </Text>
            <TouchableOpacity onPress={connectToBluetoothDevice}>
                <Text>Accéder aux données</Text>
            </TouchableOpacity>
        </View>
    </>
}