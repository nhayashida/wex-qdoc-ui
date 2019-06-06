import AppBar from '@material-ui/core/AppBar';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import React, { SyntheticEvent, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Settings } from '../reducers/app/types';
import { listCollections, updateSetting } from '../reducers/actions';
import { State } from '../reducers/store';

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    boxShadow: 'none',
    backgroundColor: 'transparent',
    '& > div': {
      padding: theme.spacing(1),
      '& > p': {
        flexGrow: 1,
      },
    },
  },
  contentHeader: theme.mixins.toolbar,
  contentBody: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
}));

interface Props {
  onClose: () => void;
  settings: Settings;
  collections: Collection[];
  listCollections: typeof listCollections;
  updateSetting: typeof updateSetting;
}

const mapStateToProps = (state: State) => ({
  settings: state.app.settings,
  collections: state.explorer.collections,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ listCollections, updateSetting }, dispatch);

// tslint:disable-next-line:variable-name
const EmptyOption = (
  <option key="" value="">
    ...
  </option>
);

// tslint:disable-next-line: variable-name
const Settings = (props: Props): JSX.Element => {
  const { settings, collections } = props;

  const classes = useStyles();

  useEffect(() => {
    if (!collections.length) {
      props.listCollections();
    }
  }, []);

  const onSelectChange = (e: SyntheticEvent<HTMLSelectElement>) => {
    props.updateSetting(e.currentTarget.name, e.currentTarget.value);
  };

  const selectProps = [
    {
      id: 'collectionId',
      label: 'Collection',
      value: settings.collectionId,
      options: [
        EmptyOption,
        ...collections.map(collection => {
          return (
            <option key={collection.id} value={collection.id}>
              {collection.name}
            </option>
          );
        }),
      ],
    },
  ];

  const collection = collections.find(collection => collection.id === settings.collectionId);
  if (collection) {
    const { fields } = collection;
    const fieldOptions = [
      EmptyOption,
      ...fields.map(field => (
        <option key={field.id} value={field.id}>
          {field.label}
        </option>
      )),
    ];

    selectProps.push(
      ...[
        { id: 'bodyField', label: 'Body Field' },
        { id: 'titleField', label: 'Title Field' },
        { id: 'linkField', label: 'Link Field' },
      ].map(props => ({
        ...props,
        value: settings[props.id],
        options: fieldOptions,
      })),
    );
  }
  const selects = selectProps.map(props => (
    <FormControl key={props.id} margin="normal">
      <InputLabel htmlFor={props.id} shrink={true}>
        {props.label}
      </InputLabel>
      <NativeSelect name={props.id} value={props.value} onChange={onSelectChange}>
        {props.options}
      </NativeSelect>
    </FormControl>
  ));

  return (
    <div>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography />
          <IconButton onClick={props.onClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <main>
        <div className={classes.contentHeader} />
        <div className={classes.contentBody}>{selects}</div>
      </main>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);
