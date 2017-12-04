import React from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout';
import './MainGrid.css';
import constStrings from './constStrings.json';
import ArmedStatus from './tiles/ArmedStatus';
import LightStatus from './tiles/LightStatus';
import Temperature from './tiles/Temperature';
import DoorAndLock from "./tiles/DoorAndLock";
import Motion from "./tiles/Motion";
import Log from "./tiles/Log";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default class MainGrid extends React.Component {
    constructor() {
        super();

        // localStorage.clear();

        const RESIZABLE_NOT_RESIZABLE = false;
        const layoutLg = [
            {i: 'arm_status', x: 0, y: 0, w: 1, h: 1, isResizable: RESIZABLE_NOT_RESIZABLE},
            {i: 'motion_status', x: 1, y: 0, w: 1, h: 2, isResizable: RESIZABLE_NOT_RESIZABLE},
            {i: 'light_status', x: 0, y: 1, w: 1, h: 1, isResizable: RESIZABLE_NOT_RESIZABLE},
            {i: 'log', x: 2, y: 0, w: 1, h: 3, isResizable: true, minW: 1, maxW: 1, maxH: 4},
            {i: 'door&lock_status', x: 1, y: 2, w: 1, h: 2, isResizable: RESIZABLE_NOT_RESIZABLE},
            {i: 'temperature', x: 0, y: 2, w: 1, h: 2, isResizable: RESIZABLE_NOT_RESIZABLE},
        ];

        const layoutMd = [
            {i: 'arm_status', x: 0, y: 0, w: 1, h: 1, isResizable: RESIZABLE_NOT_RESIZABLE},
            {i: 'motion_status', x: 1, y: 0, w: 1, h: 2, isResizable: RESIZABLE_NOT_RESIZABLE},
            {i: 'light_status', x: 0, y: 1, w: 1, h: 1, isResizable: RESIZABLE_NOT_RESIZABLE},
            {i: 'log', x: 1, y: 4, w: 1, h: 3, isResizable: true, minW: 1, maxW: 1, maxH: 4},
            {i: 'door&lock_status', x: 1, y: 2, w: 1, h: 2, isResizable: RESIZABLE_NOT_RESIZABLE},
            {i: 'temperature', x: 0, y: 2, w: 1, h: 2, isResizable: RESIZABLE_NOT_RESIZABLE},
        ];

        const layoutSm = [
            {i: 'arm_status', x: 0, y: 0, w: 1, h: 1, isResizable: RESIZABLE_NOT_RESIZABLE},
            {i: 'motion_status', x: 0, y: 4, w: 1, h: 2, isResizable: RESIZABLE_NOT_RESIZABLE},
            {i: 'light_status', x: 0, y: 1, w: 1, h: 1, isResizable: RESIZABLE_NOT_RESIZABLE},
            {i: 'log', x: 0, y: 8, w: 1, h: 3, isResizable: true, minW: 1, maxW: 1, maxH: 4},
            {i: 'door&lock_status', x: 0, y: 2, w: 1, h: 2, isResizable: RESIZABLE_NOT_RESIZABLE},
            {i: 'temperature', x: 0, y: 6, w: 1, h: 2, isResizable: RESIZABLE_NOT_RESIZABLE},
        ];

        this.state = {
            layout: [],
            alarmStatus: -1,
            lightStatus: -1,
            currentTemperature: -300,
            temperatureHistory: [],
            lastMotion: new Date(0),
            lockStatus: -1,
            doorStatus: -1,
            log: [],
            layouts: {
                lg: layoutLg,
                md: layoutMd,
                sm: layoutSm,
            },
        };
        
        if (localStorage.getItem('layouts')) {
            console.log(`Layouts from storage`);
            this.state.layouts = JSON.parse(localStorage.getItem('layouts'));
        }

        const electron = window.require('electron');

        const mqtt = electron.remote.require('mqtt');

        let options = {
            port: 1883,
            host: constStrings.mqttHost,
            username: constStrings.mqttUsername,
            password: constStrings.mqttPassword,
        };

        this.client = mqtt.connect(options);

        this.client.on('connect', () => {
            console.log('connected');
            this.client.subscribe(`${constStrings.rootTopic}/main`);
            this.client.subscribe(`${constStrings.rootTopic}/alarm`);
            this.client.subscribe(`${constStrings.rootTopic}/light`);
            this.client.subscribe(`${constStrings.rootTopic}/temp1`);
            this.client.subscribe(`${constStrings.rootTopic}/door`);
            this.client.subscribe(`${constStrings.rootTopic}/lock`);
            this.client.subscribe(`${constStrings.rootTopic}/motion`);
        });

        this.client.on('message', (topic, message) => {
            // message is Buffer
            console.log(topic, message.toString());
            if(topic.toString() === `${constStrings.rootTopic}/alarm`) {
                this.setState({alarmStatus: parseInt(message.toString(), 10)});
            }
            if(topic.toString() === `${constStrings.rootTopic}/light`) {
                this.setState({lightStatus: parseInt(message.toString(), 10)});
            }
            if(topic.toString() === `${constStrings.rootTopic}/temp1`) {
                const temp = parseFloat(message.toString());
                const tmpArr = [...this.state.temperatureHistory, { temp: temp, time: (new Date()).valueOf() }];
                tmpArr.shift();
                this.setState({currentTemperature: temp, temperatureHistory: tmpArr});
            }
            if(topic.toString() === `${constStrings.rootTopic}/door`) {
                this.setState({doorStatus: parseInt(message.toString(), 10)});
            }
            if(topic.toString() === `${constStrings.rootTopic}/lock`) {
                this.setState({lockStatus: parseInt(message.toString(), 10)});
            }
            if(topic.toString() === `${constStrings.rootTopic}/motion`) {
                this.setState({lastMotion: new Date()});
            }

            const tmpLogArr = [...this.state.log, {topic, message}];
            if(tmpLogArr.length > 100)
                tmpLogArr.shift();
            this.setState({log: tmpLogArr});

            // this.client.end()
        });

        this.client.on('error', function(err) {
            console.log(err);
        });

        this.setAlarmStatus = (newStatus) => {
            console.log('Setting alarm status', newStatus);
            this.client.publish(`${constStrings.rootTopic}/armed`, newStatus);
        };

        this.onLayoutChange = (layout, layouts) => {
            localStorage.setItem('layouts', JSON.stringify(layouts));
            console.log('layout change');
            this.setState({layouts});
        };

        this.onBreakpointChange = (newBreakpoint, newCols) => {
            console.log('breakpoint change');
            console.log(newBreakpoint, newCols);
        };

        this.loadValuesFromDatabase = (db, callback) => {
            const collection = db.collection('secureHome');
            collection.find({}).toArray((err, docs) => {
                if(err) throw err;

                console.log("Found the following records");
                console.log(docs);
                // get current alarm status
                docs.forEach((obj) => {
                    const id = obj._id;
                    console.log(obj._id);
                    if(id === 'alarm') {
                        this.setState({ alarmStatus: parseInt(obj.events[obj.events.length - 1].event.value.toString(), 10)});
                    }
                    else if(id === 'light') {
                        this.setState({ lightStatus: parseInt(obj.events[obj.events.length - 1].event.value.toString(), 10)});
                    }
                    else if(id === 'temp1') {
                        const tmpArr = [];
                        const steps = 10;
                        let i = obj.events.length > steps ? obj.events.length : steps;
                        i -= steps;
                        for(; i < obj.events.length; i++) {
                            tmpArr.push({
                                temp: parseFloat(obj.events[i].event.value.toString()),
                                time: obj.events[i].event.when.valueOf(),
                            });
                        }

                        this.setState({
                            temperatureHistory: tmpArr,
                            currentTemperature: parseFloat(obj.events[obj.events.length - 1].event.value.toString()),
                        });
                    }
                    else if(id === 'door') {
                        this.setState({ doorStatus: parseInt(obj.events[obj.events.length - 1].event.value.toString(), 10)});
                    }
                    else if(id === 'lock') {
                        this.setState({ lockStatus: parseInt(obj.events[obj.events.length - 1].event.value.toString(), 10)});
                    }
                    else if(id === 'motion') {
                        this.setState({ lastMotion: new Date(obj.events[obj.events.length - 1].event.when)});
                    }
                });
                callback(docs);
            });
        };


        const Mongo = electron.remote.require('mongodb');
        const MongoClient = Mongo.MongoClient;
        const url = constStrings.databaseUrl;

        MongoClient.connect(url, (err, db) => {
            if(err)
                throw err;

            console.log('Connected to db');

            this.loadValuesFromDatabase(db, () => db.close());

        })

    }

    render() {
        const rowHeight = 120;
        return (
            <ResponsiveReactGridLayout
                onLayoutChange={this.onLayoutChange}
                onBreakpointChange={this.onBreakpointChange}
                className="layout"
                layouts={this.state.layouts}
                rowHeight={rowHeight}
                width={1200}
                breakpoints={{lg: 900, md: 650, sm: 0}}
                cols={{lg: 3, md: 2, sm: 1}}
            >
                <div key="arm_status">
                    <ArmedStatus
                        height={rowHeight}
                        status={this.state.alarmStatus}
                        setAlarmStatus={this.setAlarmStatus}
                    />
                </div>
                <div key="motion_status">
                    <Motion height={rowHeight*2+10} lastMotion={this.state.lastMotion} />
                </div>
                <div key="light_status">
                    <LightStatus height={`${rowHeight}px`} status={this.state.lightStatus} />
                </div>
                <div key="log">
                    <Log log={this.state.log} />
                </div>
                <div key="door&lock_status">
                    <DoorAndLock
                        height={rowHeight*2+10}
                        doorStatus={this.state.doorStatus}
                        lockStatus={this.state.lockStatus}
                    />
                </div>
                <div key="temperature">
                    <Temperature
                        height={rowHeight*2+10}
                        currentTemp={this.state.currentTemperature}
                        tempHistory={this.state.temperatureHistory}
                    />
                </div>
            </ResponsiveReactGridLayout>
        );
    }
}

MainGrid.propTypes = {

};
