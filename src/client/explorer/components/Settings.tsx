import {
  AppBar,
  Toolbar,
  createStyles,
  FormControl,
  IconButton,
  InputLabel,
  NativeSelect,
  Theme,
  Typography,
  WithStyles,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, SyntheticEvent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import actions from '../actions/actions';
import { UserSettings } from '../services/storage';

const styles = (theme: Theme) =>
  createStyles({
    appBar: {
      boxShadow: 'none',
      backgroundColor: 'transparent',
    },
    toolbar: {
      padding: theme.spacing.unit,
    },
    toolbarTitle: {
      flexGrow: 1,
    },
    contentHeader: theme.mixins.toolbar,
    contentBody: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing.unit * 2,
    },
    formControl: {
      marginBottom: theme.spacing.unit * 4,
    },
  });

interface Props extends WithStyles<typeof styles> {
  collections: Explorer.Collection[];
  settings: UserSettings;
  updateSetting: (key: string, value: string) => void;
  onClose: () => void;
}

const mapStateToProps = (state: Props) => ({
  settings: state.settings,
  collections: state.collections,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actions, dispatch);

// tslint:disable-next-line:variable-name
const EmptyOption = (
  <option key="" value="">
    ...
  </option>
);

class Settings extends Component<Props> {
  onClose = () => {
    this.props.onClose();
  };

  onSelectChange = (e: SyntheticEvent<HTMLSelectElement>) => {
    this.props.updateSetting(e.currentTarget.name, e.currentTarget.value);
  };

  generateSelects(): JSX.Element[] {
    const { classes, settings, collections } = this.props;
    const collection = collections.find(collection => collection.id === settings.collectionId);

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

    if (collection) {
      const { fields } = collection;
      const fieldOptions = [
        EmptyOption,
        ...fields.map(field => {
          return (
            <option key={field.id} value={field.id}>
              {field.label}
            </option>
          );
        }),
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

    return selectProps.map(props => (
      <FormControl key={props.id} className={classes.formControl}>
        <InputLabel htmlFor={props.id} shrink={true}>
          {props.label}
        </InputLabel>
        <NativeSelect name={props.id} value={props.value} onChange={this.onSelectChange}>
          {props.options}
        </NativeSelect>
      </FormControl>
    ));
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <AppBar className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <Typography className={classes.toolbarTitle} />
            <IconButton onClick={this.onClose}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <main>
          <div className={classes.contentHeader} />
          <div className={classes.contentBody}>{this.generateSelects()}</div>
        </main>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles, { withTheme: true })(Settings));
