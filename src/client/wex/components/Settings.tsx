import AppBar from '@material-ui/core/AppBar';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import React, { ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  main: {
    display: 'flex',
    justifyContent: 'center',
    '& > div': {
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: 960,
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
}

// tslint:disable-next-line:variable-name
const EmptyOption = (
  <MenuItem key="" value="">
    ...
  </MenuItem>
);

// tslint:disable-next-line: variable-name
const Settings = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const settings = useSelector((state: State) => state.app.settings);
  const collections = useSelector((state: State) => state.wex.collections);

  const classes = useStyles();

  useEffect(() => {
    if (!collections.length) {
      dispatch(listCollections());
    }
  }, []);

  const onSelectChange = (e: ChangeEvent<{ name: string; value: string }>) => {
    dispatch(updateSetting(e.target.name, e.target.value));
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
            <MenuItem key={collection.id} value={collection.id}>
              {collection.name}
            </MenuItem>
          );
        }),
      ],
    },
  ];

  const found = collections.find(collection => collection.id === settings.collectionId);
  if (found) {
    const { fields } = found;
    const fieldOptions = [
      EmptyOption,
      ...fields.map(field => (
        <MenuItem key={field.id} value={field.id}>
          {field.label}
        </MenuItem>
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
  const selectControls = selectProps.map(props => (
    <FormControl key={props.id} margin="normal">
      <InputLabel htmlFor={props.id} shrink={true}>
        {props.label}
      </InputLabel>
      <Select name={props.id} value={props.value} displayEmpty={true} onChange={onSelectChange}>
        {props.options}
      </Select>
    </FormControl>
  ));

  return (
    <React.Fragment>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography />
          <IconButton onClick={props.onClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <main className={classes.main}>
        <div>
          <div className={classes.contentHeader} />
          <div className={classes.contentBody}>{selectControls}</div>
        </div>
      </main>
    </React.Fragment>
  );
};

export default Settings;
