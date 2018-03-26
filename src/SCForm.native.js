import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PropTypes from 'prop-types';
import translate from './translate';
import validateFields from './validateFields';
import transform from 'tcomb-json-schema';
import tcomb from 'tcomb-form-native';
import scstyles from './scstyles';

transform.registerType('date', tcomb.Date);

const Form = tcomb.form.Form;

class SCForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {},
      renderPlaceholderOnly: true,
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    const formInfo = this.props.form;
    const { schema, options, initialValues } = translate({
      scSchema: formInfo,
    });
    this.setState({ schema, options, value: initialValues });
    this.initialValues = initialValues;
    this.options = options;
    this.TcombType = transform(schema);
  }

  getValue() {
    let values = {};
    let fields = this.form.refs.input.refs;

    for (let ref in fields) {
      if (fields.hasOwnProperty(ref)) {
        values[ref] = fields[ref].getValue();
      }
    }

    return values;
  }

  onChange(value) {
    this.setState({ value });
  }

  onSubmit() {
    const formData = this.getValue();

    let result = validateFields(formData, this.state.schema, this.state.options);
    this.setState({ options: result.options });
    let title = 'Save Feature';
    let msg = 'Save feature and sync it with GeoSHAPE Exchange.';
    if (this.props.operation === 'update') {
      title = 'Save Changes';
      msg = 'Save changes and sync them with GeoSHAPE Exchange.'
    }
    if (!result.hasError) {
      Alert.alert(title, msg, [
        { text: 'Cancel' },
        { text: 'Save', onPress: () => this.props.saveForm(formData) },
      ]);
    } else {
      Alert.alert('Invalid Form', 'Please fix all form errors and resubmit.', [{ text: 'OK' }]);
    }
  }
  formSubmitted() {
    // https://github.com/facebook/react-native/issues/10471
    requestAnimationFrame(() => {
      Alert.alert('Success', 'Feature saved and synced with GeoSHAPE Exchange.', [
        { text: 'Done', onPress: () => this.props.navigation.goBack() },
      ]);
    });
  }

  formSubmittedOffline() {
    // https://github.com/facebook/react-native/issues/10471
    requestAnimationFrame(() => {
      Alert.alert(
        'Saved',
        'This change has been saved to your device. Connect to a network to sync it to GeoSHAPE Exchange.',
        [
          { text: 'Done', onPress: () => this.props.navigation.goBack() },
        ]
      );
    });
  }

  formSubmittedError() {
    // https://github.com/facebook/react-native/issues/10471
    requestAnimationFrame(() => {
      Alert.alert('Error', 'There was an error submitting this form. Please try again.', [
        { text: 'OK' },
      ]);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.submitting && (
          <Modal visible={this.props.submitting} transparent onRequestClose={() => {}}>
            <View style={styles.modalContainer}>
              <View style={styles.modal}>
                <ActivityIndicator size="large" animating={this.props.submitting} />
              </View>
            </View>
          </Modal>
        )}
        <KeyboardAwareScrollView
          style={styles.scrollView}
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={true}
          extraHeight={164}
        >
          <View style={styles.form}>
            <Form
              ref={ref => {
                this.form = ref;
              }}
              value={this.state.value}
              type={this.TcombType}
              options={this.state.options}
              onChange={this.onChange}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

SCForm.propTypes = {
  form: PropTypes.object.isRequired,
  submitting: PropTypes.bool.isRequired,
  saveForm: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: 'white',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Platform.OS === 'ios' ? 10 : 2,
  },
});

export default SCForm;
