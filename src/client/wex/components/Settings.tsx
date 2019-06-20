import AppBar from '@material-ui/core/AppBar';
import CircularProgress from '@material-ui/core/CircularProgress';
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
import clsx from 'clsx';
import isUndefined from 'lodash/isUndefined';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Settings } from '../reducers/app/types';
import { State } from '../reducers/store';
import { updateSettings } from '../reducers/app/actions';
import { clearQueryResult, listCollections } from '../reducers/wex/actions';
import { Collection } from '../reducers/wex/types';
import { usePrevious } from './hooks';

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
    '&.loading': {
      display: 'none',
    },
  },
  progress: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    display: 'none',
    '&.loading': {
      display: 'flex',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
  },
}));

interface Props {
  onClose: () => void;
}

// tslint:disable-next-line: variable-name
const Settings = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const settings = useSelector((state: State) => state.app.settings);
  const collections = useSelector((state: State) => state.wex.collections);

  const classes = useStyles();

  const [collection, setCollection] = useState<Collection>();
  const [collectionId, setCollectionId] = useState(settings.collectionId || '');
  const [titleFieldId, setTitleFieldId] = useState(settings.titleFieldId || '');
  const [linkFieldId, setLinkFieldId] = useState(settings.linkFieldId || '');

  const prevCollectionId = usePrevious(collectionId);

  useEffect(() => {
    if (!collections.length) {
      dispatch(listCollections());
    }
  }, []);

  useEffect(() => {
    const found = collections.find(item => item.id === collectionId);
    if (found) {
      setCollection(found);
    }
  }, [collections]);

  useEffect(() => {
    if (!isUndefined(prevCollectionId) && prevCollectionId !== collectionId) {
      const found = collections.find(item => item.id === collectionId);
      if (found) {
        setCollection(found);
        setTitleFieldId('');
        setLinkFieldId('');

        dispatch(
          updateSettings({
            collectionId,
            bodyFieldId: found.bodyFieldId,
            titleFieldId: '',
            linkFieldId: '',
          }),
        );

        dispatch(clearQueryResult());
      }
    }
  }, [collectionId]);

  const onCollectionChange = (e: ChangeEvent<{ value: string }>) => {
    setCollectionId(e.target.value);
  };

  const onTitleFieldChange = (e: ChangeEvent<{ name: string; value: string }>) => {
    const { name, value } = e.target;
    setTitleFieldId(value);
    dispatch(updateSettings({ [name]: value }));
  };

  const onLinkFieldChange = (e: ChangeEvent<{ name: string; value: string }>) => {
    const { name, value } = e.target;
    setLinkFieldId(value);
    dispatch(updateSettings({ [name]: value }));
  };

  const selectProps = [
    {
      id: 'collectionId',
      label: 'Collection',
      value: collectionId,
      onChange: onCollectionChange,
      options: collections.map(collection => (
        <MenuItem key={collection.id} value={collection.id}>
          {collection.name}
        </MenuItem>
      )),
    },
  ];
  if (collection) {
    const { fields } = collection;
    const fieldOptions = fields.map(field => (
      <MenuItem key={field.id} value={field.id}>
        {field.label}
      </MenuItem>
    ));
    selectProps.push(
      ...[
        {
          id: 'titleFieldId',
          label: 'Title Field',
          value: titleFieldId,
          onChange: onTitleFieldChange,
          options: fieldOptions,
        },
        {
          id: 'linkFieldId',
          label: 'Link Field',
          value: linkFieldId,
          onChange: onLinkFieldChange,
          options: fieldOptions,
        },
      ],
    );
  }
  const selectControls = selectProps.map(item => (
    <FormControl key={item.id} margin="normal">
      <InputLabel htmlFor={item.id}>{item.label}</InputLabel>
      <Select name={item.id} value={item.value} onChange={item.onChange}>
        {item.options}
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
          <div className={clsx(classes.contentBody, { loading: !collections.length })}>
            {selectControls}
          </div>
        </div>
      </main>
      <div className={clsx(classes.progress, { loading: !collections.length })}>
        <CircularProgress />
      </div>
    </React.Fragment>
  );
};

export default Settings;
