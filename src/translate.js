import sortBy from 'lodash/sortBy';
import cloneDeep from 'lodash/cloneDeep';
import formtemplates from './formtemplates';
import scstyles from 'scstyles';
import moment from 'moment';

let fieldMap = {
  is_required: 'required',
  is_integer: 'integer',
  initial_value: 'initialValue',
  minimum_length: 'minLength',
  maximum_length: 'maxLength',
  exclusive_minimum: 'exclusiveMinimum',
  exclusive_maximum: 'exclusiveMaximum',
  options: 'enum',
  minimum: 'minimum',
  maximum: 'maximum',
  pattern: 'pattern',
};

function translate({ scSchema, onFocus }) {
  let schema = {
    type: 'object',
    required: [],
    properties: {},
  };
  let options = {
    stylesheet: scstyles.formStyle,
    auto: 'none',
    fields: {},
  };
  let fields = sortBy(cloneDeep(scSchema.fields), 'position');
  fields.forEach(field => {
    let label =
      (field.field_label ? field.field_label : 'Enter a Label') + (field.is_required ? ' *' : '');
    let fieldOptions = {
      label: label,
      onFocus: onFocus ? onFocus : () => {},
    };

    fieldOptions.config = field;

    if (field.type == 'string' || field.type == 'number') {
      fieldOptions.config.fieldType = field.type;
      fieldOptions.template = formtemplates.text;
    }
    if (field.type == 'photo') {
      field.type = 'string';
      fieldOptions.template = formtemplates.photos;
    }
    if (field.type == 'counter') {
      field.type = 'number';
      fieldOptions.template = formtemplates.counter;
    }
    if (field.type == 'slider') {
      field.type = 'number';
      fieldOptions.template = formtemplates.slider;
    }
    if (field.type == 'select') {
      field.type = 'string';
    }
    if (field.type == 'date') {
      fieldOptions.mode = 'date';
      fieldOptions.config = {
        format: (date) => (date === 'Invalid Date') ? moment(new Date()).format('DD/MM/YYYY') : moment(date).format('DD/MM/YYYY'), 
      };
    }
    if (field.type == 'time') {
      fieldOptions.mode = 'time';
    }
    if (field.type == 'boolean') {
      fieldOptions.template = formtemplates.checkbox;
    }

    for (let key in fieldMap) {
      if (field.hasOwnProperty(key)) {
        field[fieldMap[key]] = field[key];
        delete field[key];
      }
      if (field.constraints && field.constraints.hasOwnProperty(key)) {
        field[fieldMap[key]] = field.constraints[key];
        delete field.constraints[key];
      }
    }
    delete field.constraints;
    schema.properties[field.field_key] = field;
    options.fields[field.field_key] = fieldOptions;
  });
  let initialValues = {};
  for (let prop in schema.properties) {
    if (schema.properties[prop].hasOwnProperty('initialValue')) {
      console.log(`set initial value for ${prop} to ${JSON.stringify(schema.properties[prop])}`)
      initialValues[prop] = schema.properties[prop].initialValue;
      if (/*Platform.OS === 'android' && */schema.properties[prop].type === 'date') {
        initialValues[prop] = schema.properties[prop].initialValue ? new Date(schema.properties[prop].initialValue) : new Date();
        console.log('initial value is', initialValues[prop])
      }
    } else {
      initialValues[prop] = null;
    }
  }
  schema.required = fields.filter(f => f.required).map(f => f.field_key);
  return { schema, options, initialValues };
}

export default translate;
