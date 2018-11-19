import React, { Component } from "react";
import { TouchableWithoutFeedback, Animated, Dimensions, KeyboardAvoidingView, ScrollView, View, Alert, Keyboard, Text } from "react-native";

import { Actions } from "react-native-router-flux";
import SvgImage from "react-native-remote-svg";
import moment from "moment";

import LoadingContainer from "@/components/LoadingContainer";

import Header from "./Header";
import Info from "./Info";
import DaumMap from "./DaumMap";
import Write from "./Write";
import UploadPhoto from "./UploadPhoto";
import ReviewItem from "./ReviewItem";
import PhotoGallery from "./PhotoGallery";

import { ShopApi } from "@/apis";

const deviceHeight = Dimensions.get("window").height;

import CONFIG, { textResizing, marginResizing } from "@/config";

export default class Review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      shop: props.navigation.state.params.id,
      order: props.navigation.state.params.order || null,
      photos: [],
      uploadPopupOpen: false,
      uploadPopupTop: new Animated.Value(deviceHeight),
      galleryPopupOpen: false,
      galleryPopupTop: new Animated.Value(deviceHeight),
      galleryPhotos: [],
      POINT: null,
      stopScroll: false,
      keyboard: false,
      reviews: [],
      REVIEWS: [],
      reviewPage: 1,
      next: true
    };

    this.keyboardWillShowListener = Keyboard.addListener("keyboardWillShow", this.keyboardWillShow);
    this.keyboardWillHideListener = Keyboard.addListener("keyboardWillHide", this.keyboardWillHide);
  }

  keyboardWillShow = () => this.setState({ keyboard: true });
  keyboardWillHide = () => this.setState({ keyboard: false });

  componentDidMount = () => {
    this.updateShopInfo();
    this.getReview(1);
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    if (
      moment(nextState.ENDDATE)
        .add(1, "days")
        .unix() < moment().unix()
    ) {
      Alert.alert("현재 무바 서비스를 이용하지 않는 업체입니다.");
      Actions.pop({ id: this.props.id });
      return false;
    }

    return true;
  };

  updateShopInfo = () =>
    ShopApi.getShopInfo({ id: this.props.id }).then(res =>
      this.setState({
        ...res.data.shop,
        ENDDATE: res.data.shop.ENDDATE,
        MENUS: res.data.shop.shop_menus,
        loading: false
      })
    );

  getReview = page => {
    const p = page || this.state.reviewPage;
    ShopApi.getReview({ shop: this.state.shop, page: p }).then(review =>
      this.setState({ REVIEWS: p === 1 ? review : this.state.REVIEWS.concat(review), loading: false, reviewPage: p + 1, next: review.length !== 0 })
    );
  };

  uploadPhoto = () => {
    Animated.timing(this.state.uploadPopupTop, { toValue: 0, duration: 300 }).start();
    this.setState({ uploadPopupOpen: true });
  };
  closeUploadPopup = () => {
    Animated.timing(this.state.uploadPopupTop, { toValue: deviceHeight, duration: 300 }).start();
    this.setState({ uploadPopupOpen: false });
  };

  galleryPhoto = photos => {
    Animated.timing(this.state.galleryPopupTop, { toValue: 0, duration: 300 }).start();
    this.setState({ galleryPopupOpen: true, galleryPhotos: photos });
  };

  closeGalleryPhoto = () => {
    Animated.timing(this.state.galleryPopupTop, { toValue: deviceHeight, duration: 300 }).start();
    this.setState({ galleryPopupOpen: false });
  };

  selectPhotos = photos => this.setState({ photos: photos });
  scrollToggle = () => this.setState({ stopScroll: !this.state.stopScroll });

  writeReview = (text, point) => {
    if (text === "") return Alert.alert("내용을 입력해주세요.");

    const data = new FormData();
    data.append("text", text);
    data.append("point", point);

    this.state.photos.forEach(photo => {
      data.append("photo", {
        uri: photo.node.image.uri,
        type: photo.node.type,
        name: photo.node.image.filename
      });
    });

    ShopApi.writeReview({ shop: this.state.shop, id: this.state.order, data: data }).then(() => {
      Alert.alert("리뷰를 남겨주셔서 감사합니다.");
      this.setState({ order: null });
      this.updateShopInfo();
      this.getReview(1);
    });
  };

  onScroll = ({ layoutMeasurement, contentOffset, contentSize }) => {
    if (contentSize.height - layoutMeasurement.height <= contentOffset.y) {
      if (!this.state.next || this.state.loading) return null;
      this.setState({ loading: true });
      this.getReview();
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <LoadingContainer requireAuth={true} header={Header} loading={this.state.loading}>
          <KeyboardAvoidingView behavior="position" enabled={this.state.keyboard}>
            <ScrollView scrollEnabled={!this.state.stopScroll} onScroll={({ nativeEvent }) => this.onScroll(nativeEvent)}>
              <View style={{ borderBottomColor: "#f1f3f5", borderBottomWidth: 10 }}>
                <View style={{ marginTop: 30, paddingLeft: 20, paddingRight: 20, paddingBottom: 25, borderBottomColor: "#dee2e6", borderBottomWidth: 1 }}>
                  <Info {...this.state} />
                </View>

                {this.state.ADDRESS !== "" ? (
                  <TouchableWithoutFeedback
                    onPress={() =>
                      Actions.push("daumMapShop", {
                        name: this.state.SHOPNAME,
                        address: this.state.ADDRESS,
                        lat: this.state.ADDRLAT,
                        lng: this.state.ADDRLNG
                      })
                    }
                  >
                    <View style={{ width: "100%", height: 200, borderBottomColor: "#dee2e6", borderBottomWidth: 1 }}>
                      <DaumMap name={this.state.SHOPNAME} address={this.state.ADDRESS} lat={this.state.ADDRLAT} lng={this.state.ADDRLNG} />
                    </View>
                  </TouchableWithoutFeedback>
                ) : null}
              </View>

              {this.state.order !== null ? (
                <View style={{ borderBottomColor: "#f1f3f5", borderBottomWidth: 10 }}>
                  <Write photos={this.state.photos} uploadPhoto={this.uploadPhoto} scrollToggle={this.scrollToggle} writeReview={this.writeReview} />
                </View>
              ) : null}

              {this.state.REVIEWS.length !== 0 ? (
                this.state.REVIEWS.map((v, i) => (v.order ? <ReviewItem key={v._id} {...v} galleryPhoto={this.galleryPhoto} /> : null))
              ) : (
                <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 30 }}>
                  <Text style={{ fontSize: textResizing(20), fontWeight: "bold", color: "#212529" }}>리뷰가 존재하지 않습니다.</Text>
                </View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </LoadingContainer>

        <Animated.View style={{ position: "absolute", width: "100%", height: "100%", top: this.state.uploadPopupTop, zIndex: 10000 }}>
          <UploadPhoto open={this.state.uploadPopupOpen} closeUploadPopup={this.closeUploadPopup} selectPhotos={this.selectPhotos} />
        </Animated.View>

        <Animated.View style={{ position: "absolute", width: "100%", height: "100%", top: this.state.galleryPopupTop, zIndex: 10000 }}>
          <PhotoGallery open={this.state.galleryPopupOpen} closePopup={this.closeGalleryPhoto} photos={this.state.galleryPhotos} />
        </Animated.View>
      </View>
    );
  }
}
