import React from "react";
import {
    Text,
    View,
    Platform,
    ScrollView,
    ListView,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    Alert,
    Picker
} from "react-native";
import { DefaultTabBar } from "react-native-scrollable-tab-view";
import Button from "apsl-react-native-button";
var GLOBAL = require('../Globals');
var ProgressBar = require('react-native-progress-bar');
var Modal = require('react-native-modalbox');

var Markdown = require('react-native-markdown');


/**
 * Import the project card component
 * @type {ProjectCard|exports|module.exports}
 */
var ProjectCard = require('./ProjectCard');


/**
 * Styling properties for the class
 */


var style = StyleSheet.create({

    closeButton: {
        backgroundColor: '#212121',
        alignItems: 'stretch',

        height: 50,
        padding: 12,
        borderRadius: 5,
        borderWidth: 0.1,
        position: 'absolute',
        bottom: 20,
        left: 20,
        width: 260
    },
    projectViewContainer: {
        flex: 1
    },
    detailContainer: {
        flex: 1,
        marginLeft: 15,
        marginRight: 15,
        paddingTop: 20

    },
    headerContainer: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        borderRadius: 5,
        height: 250,
        borderRadius: 0,
    },
    overlay: {
        backgroundColor: 'rgba(52,52,52,0.7)',
        flex: 1,
        height: 250,
        alignItems: 'center',
        justifyContent: 'center'
    },
    overlayProjectName: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 20,
        width: 200,
        textAlign: 'center'
    },
    bottomTextArea: {
        position: 'absolute',
        flex: 1,
        height: 175,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: 'transparent',

    },
    backButton: {
        width: 20,
        height: 20,
    },
    backButtonContainer: {
        width: 60,
        height: 60,
        top: 0,
        padding: 20,
        left: 0,
        position: 'absolute'
    },
    bookmarkButton: {
        borderWidth: 0,
        backgroundColor: 'transparent',
        width: 15,
        resizeMode: 'contain',
        right: 25,
        top: 0,
        position: 'absolute',
    },
    projectName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#212121',
    },

    projectDetails: {
        width: GLOBAL.SCREEN_WIDTH
    },

    heart: {
        width: 13,
        height: 13,
        resizeMode: 'contain',
        marginTop: 5

    },

    infoArea: {
        borderTopWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderColor: '#212121',

        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: GLOBAL.SCREEN_WIDTH,
        backgroundColor: 'rgba(52,52,52,0.5)'
    },
    infoBlock: {
        borderColor: '#212121',
        flex: 1,
        height: 30,
        flexDirection: 'row'
    },
    infoBlockText: {

        color: '#e8e8e8',
        fontWeight: '500',
        fontSize: 11,
        marginLeft: 20,
        width: 170,
        height: 30,
        marginTop: 3
    },
    infoIcon: {
        marginLeft: 20,
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    mmLogo: {
        width: 100,
        height: 30,
        resizeMode: 'contain',
    },
    startButton: {
        marginTop: 10,
        backgroundColor: '#0c1949',
        flex: 1,
        height: 50,
        padding: 12,
        borderRadius: 5,
        borderWidth: 0.1,
    },
    startButton2: {
        marginTop: 10,
        backgroundColor: '#e61c1c',
        flex: 1,
        height: 50,
        padding: 12,
        borderRadius: 5,
        borderWidth: 0.1,
    },
    startButtonTutorial: {
        marginTop: 10,
        backgroundColor: '#33A929',
        flex: 1,
        height: 50,
        padding: 12,
        borderRadius: 5,
        borderWidth: 0.1,
    },
    inProgressButton: {
        marginTop: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1,
        height: 50,
        padding: 12,
        borderRadius: 5,
        borderWidth: 0.1,
    },

    downloadButton: {
        backgroundColor: '#0d1949',
        height: 50,
        padding: 12,
        borderRadius: 5,
        borderWidth: 0.1,
        width: 260
    },
    header: {
        fontWeight: '700',
        color: '#212121',
        fontSize: 18,
    },
    tutRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        height: 40,
    },

    tutPar: {
        fontSize: 13,
        color: '#575757',
        fontWeight: '500',
        lineHeight: 20
    },

    tutText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#50acd4',
        marginTop: 5,
        lineHeight: 20,
    },


    modal: {
        padding: 20,
    },

    modal2: {
        height: 230,
        backgroundColor: "#3B5998"
    },

    modal3: {
        height: 500 > GLOBAL.SCREEN_HEIGHT ? GLOBAL.SCREEN_HEIGHT - 50 : 500,
        width: 300,
        backgroundColor: "#ffffff",
        borderRadius: 2
    },


});

/**
 * This is the base view for the project navigation, the individual tabs are rendered within here.
 */

var ProjectView = React.createClass({
    render() {
        ;

        return <ProjectHeader style={style.headerContainer} navigator={this.props.navigator}
            data={this.props.data}></ProjectHeader>;
    },
});

var ProjectHeader = React.createClass({


    getInitialState() {
        return {
            progress: 0,
            language: null,
            availableOffline: 0,
            hasOfflineGroups: false
        };
    },

    returnToView: function () {

        this.props.navigator.pop();
    },

    mounted: false,
    componentDidMount() {
        GLOBAL.GRADIENT_COUNT = 0;
        this.mounted = true;
        GLOBAL.ANALYTICS.logEvent('project_view_opened');
        var parent = this;
        parent.setState({
            hasOfflineGroups: GLOBAL.DB.hasOfflineGroups('project-' + this.props.data.id)
        });
        setInterval(function () {
            if (!parent.mounted) {
                return;
            }
            let progress = 0;
            var projectKey = "project-" + parent.props.data.id;
            if (GLOBAL.DB.totalRequestsOutstanding2[projectKey] !== undefined) {
                progress = Math.ceil(100 - ((GLOBAL.DB.totalRequestsOutstanding2[projectKey] / GLOBAL.DB.totalRequests[projectKey]) * 100));
            }
            parent.setState({
                progress: progress,
                hasOfflineGroups: GLOBAL.DB.hasOfflineGroups('project-' + parent.props.data.id)
            })
        }, 300);


    },

    componentWillUnmount() {
        this.mounted = false;
    },


    _handlePress() {
        var parent = this;
        if (GLOBAL.DB.hasOpenDownloads('project-' + this.props.data.id) === false) {
            this.checkWifiMapping();
        } else {
            Alert.alert(
                'You are currently downloading this project',
                'To avoid double-mapping, please pick another project to map online.',
                [
                    {
                        text: 'Okay',
                        onPress: () => this.props.navigator.push({ id: 1, data: this.props.data, paging: true })
                    },
                    { text: 'Close', onPress: () => {}/*console.log("closed")*/ },
                ]
            )
        }


    },

    _handleLater() {
        this.openModal3();
    },

    openModal3: function (id) {
        this.refs.modal3.open();
    },

    returnToView: function () {
        this.props.navigator.pop();
    },
    closeModal3: function (id) {
        this.refs.modal3.close();
    },

    checkWifiMapping() {
        var parent = this;

        if (GLOBAL.DB.getConnectionManager().isOnWifi() || !GLOBAL.DB.getConnectionManager().isOnline()) {
            this.props.navigator.push({ id: 3, data: this.props.data, paging: true })
        } else {
            Alert.alert(
                'Warning: You are not on wifi',
                'You can map about 8 hours per 1GB of data',
                [
                    { text: 'Cancel', onPress: () => {} /*console.log("canceled wifi mapping")*/ },
                    {
                        text: 'Continue',
                        onPress: () => parent.props.navigator.push({ id: 3, data: this.props.data, paging: true })
                    },
                ]
            )
        }
    },

    checkWifiDownload(originalTaskAmount) {

        var parent = this;
        return function (taskAmount) {

            if (!GLOBAL.DB.getConnectionManager().isOnline()) {
                Alert.alert(
                    'Warning: You are offline',
                    'Connect to a network and try again',
                    [
                        {
                            text: 'Got it', onPress: () => {
                                //console.log("canceled wifi");
                                parent.closeModal3();
                            }
                        }

                    ]
                )
            } else if (GLOBAL.DB.getConnectionManager().isOnWifi()) {
                //console.log("We're headed to download" + originalTaskAmount + " tasks!");
                Alert.alert(
                    'Be patient!',
                    'It might take a while for your download to start. ',
                    [
                        {
                            text: 'Ok', onPress: () => {
                                parent.closeModal3();
                            }
                        }
                    ]
                )
                GLOBAL.DB.getTaskGroupsForProject(parent.props.data.id, -1, originalTaskAmount, parent.props.data.groupAverage, true);
                parent.closeModal3();
            } else {
                Alert.alert(
                    'Warning: You are not on wifi',
                    'Are you sure you wish to continue this download?',
                    [
                        {
                            text: 'Cancel', onPress: () => {
                                //console.log("canceled wifi");
                                parent.closeModal3();
                            }
                        },
                        {
                            text: 'Continue', onPress: () => {
                                //console.log("We're headed to download" + originalTaskAmount + " tasks!");
                                GLOBAL.DB.getTaskGroupsForProject(parent.props.data.id, -1, originalTaskAmount, parent.props.data.groupAverage, true);
                                parent.closeModal3();
                            }
                        },
                    ]
                )
            }
        }
    },

    _handleInProgress() {

    },

    _handleRemoval(projectId) {
        return function () {
            var found = GLOBAL.DB.removeOfflineProject(projectId);
            Alert.alert(
                'Deletion Complete',
                'We found ' + found + ' groups in this project and deleted them.',
                [
                    { text: 'Okay', onPress: () => {}/*console.log("closed")*/ },
                    { text: 'Close', onPress: () => {}/*console.log("closed")*/ },
                ]
            )
        }
    },

    _handleProjectRemoval(projectId) {
        return function () {
            GLOBAL.DB.removeProject(projectId);
            Alert.alert(
                'Project Reset Complete',
                'Your progress will still be synced! Try Now!',
                [
                    { text: 'Okay', onPress: () => {} /*console.log("closed")*/ },
                ]
            )
        }
    },
    render() {


        var renderQueue = [];
        var chunks = this.props.data.projectDetails.split('\\n');
        chunks.forEach(function (chunk) {
            renderQueue.push(chunk, '\n');
        });

        return <ScrollView style={style.projectViewContainer}>
            <Image

                style={style.backgroundImage}
                source={{ uri: this.props.data.image }}
            >
                <View style={style.overlay}>

                    <Text style={style.overlayProjectName}>{this.props.data.name.toUpperCase()}</Text>
                    <View style={style.bottomTextArea}>

                        <View style={style.infoArea}>
                            <View style={style.infoBlock}><Image style={style.infoIcon}
                                source={require('./assets/heart_icon.png')} /><Text
                                    style={style.infoBlockText}>{this.props.data.progress}% GLOBAL PROGRESS
                                BY {this.props.data.contributors} MAPPERS JUST LIKE YOU.</Text><Image
                                    style={style.mmLogo} source={require('./assets/mmwhite.png')} /></View>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={style.backButtonContainer} onPress={this.returnToView}><Image
                    style={style.backButton} source={require('./assets/backarrow_icon.png')} /></TouchableOpacity>
            </Image
            >

            <View style={style.detailContainer}>

                <Markdown style={style.projectDetails}>{renderQueue}
                </Markdown>
                <Button style={style.startButtonTutorial} onPress={() => {
                    this.props.navigator.push({
                        id: 5,
                        data: GLOBAL.TUT_LINK,
                        paging: true
                    })
                }} textStyle={{ fontSize: 13, color: '#ffffff', fontWeight: '700' }}>
                    Tutorial
                </Button>
                <Button style={style.startButton} onPress={this._handlePress}
                    textStyle={{ fontSize: 13, color: '#ffffff', fontWeight: '700' }}>
                    Map Now ({this.state.hasOfflineGroups === false ? "requires network" : "available offline"})
                </Button>
                <Button
                    style={this.state.progress === 0 || this.state.progress == 100 ? style.startButton : style.inProgressButton}
                    onPress={this.state.progress === 0 ? this._handleLater : this._handleInProgress}
                    textStyle={{ fontSize: 13, color: '#ffffff', fontWeight: '700' }}>
                    {this.state.progress === 0 || this.state.progress === 100 || !this.state.progress ? "Download For Later" : "Downloading (" + this.state.progress + "%)"}
                </Button>

                <Button style={style.startButton2} onPress={this._handleProjectRemoval('project-' + this.props.data.id)}
                    textStyle={{ fontSize: 13, color: '#ffffff', fontWeight: '700' }}>
                    Bugs? Clear Project Data
                </Button>

                {this.state.hasOfflineGroups === true ?
                    <Button style={style.startButton2} onPress={this._handleRemoval('project-' + this.props.data.id)}
                        textStyle={{ fontSize: 13, color: '#ffffff', fontWeight: '700' }}>
                        Remove Offline Data
                    </Button> : null}
            </View>
            <Modal style={[style.modal, style.modal3]} backdropType="blur" position={"center"} ref={"modal3"}
                isDisabled={this.state.isDisabled}>
                <Text style={style.header}>Download Options</Text>
                <Text style={style.tutPar}>We will let you know when your download ends, it will be auto-deleted after
                    completion. Do not close the Mapswipe app.
                </Text>
                <View style={style.tutRow}><Text style={style.tutText}>About 10 min of mapping</Text></View>
                <Button style={style.downloadButton} onPress={this.checkWifiDownload(1000)}
                    textStyle={{ fontSize: 13, color: '#ffffff', fontWeight: '700' }}>
                    Download 1k tiles (approx 20MB)
                </Button>
                <View style={style.tutRow}><Text style={style.tutText}>About 40 min of mapping </Text></View>
                <Button style={style.downloadButton} onPress={this.checkWifiDownload(4000)}
                    textStyle={{ fontSize: 13, color: '#ffffff', fontWeight: '700' }}>
                    Download 4k tiles (approx 80MB)
                </Button>
                <View style={style.tutRow}><Text style={style.tutText}>About 2.5 hrs of mapping</Text></View>
                <Button style={style.downloadButton} onPress={this.checkWifiDownload(16000)}
                    textStyle={{ fontSize: 13, color: '#ffffff', fontWeight: '700' }}>
                    Download 16k tiles (approx 320MB)
                </Button>
                <Button style={style.closeButton} onPress={this.closeModal3}
                    textStyle={{ fontSize: 13, color: '#ffffff', fontWeight: '700' }}>
                    Cancel
                </Button>
            </Modal>
        </ScrollView>
            ;
    },
});
//


module.exports = ProjectView;
