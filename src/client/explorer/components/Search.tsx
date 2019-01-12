import { grey } from '@material-ui/core/colors';
import {
  createStyles,
  Card,
  CardContent,
  IconButton,
  InputBase,
  LinearProgress,
  Theme,
  Typography,
  WithStyles,
} from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import actions from '../actions/actions';
import { UserSettings } from '../reducers/reducers';
import { QueryResult } from '../../../server/services/explorer';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: `${theme.spacing.unit * 2}px`,
    },
    inputContainer: {
      display: 'flex',
      border: `1px solid ${grey[300]}`,
      borderRadius: theme.typography.pxToRem(16),
    },
    textInput: {
      flexGrow: 1,
      paddingLeft: theme.spacing.unit * 2,
    },
    iconButton: {
      padding: theme.spacing.unit,
    },
    progress: {
      marginTop: theme.spacing.unit * 2,
      display: 'none',
      '&.querying': {
        display: 'block',
      },
    },
    resultCard: {
      boxShadow: 'none',
      backgroundColor: 'transparent',
    },
    resultCardContent: {
      padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px`,
      '&:last-child': {
        paddingBottom: theme.spacing.unit,
      },
    },
    retultTitle: {
      fontSize: theme.typography.pxToRem(16),
    },
    retultBody: {
      fontSize: theme.typography.pxToRem(12),
      color: grey[700],
    },
  });

interface Props extends WithStyles<typeof styles> {
  settings: UserSettings;
  queryInput: string;
  queryResult: QueryResult;
  querying: boolean;
  setQueryInput: (input: string) => {};
  query: (input: string) => {};
}

const mapStateToProps = (state: Props) => ({
  settings: state.settings,
  queryInput: state.queryInput,
  queryResult: state.queryResult,
  querying: state.querying,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actions, dispatch);

class Search extends Component<Props> {
  onInputChange = e => {
    this.props.setQueryInput(e.currentTarget.value);
  };

  onInputKeyDown = e => {
    if (e.key === 'Enter') {
      this.onSearchClick();
    }
  };

  onSearchClick = async () => {
    this.props.query(this.props.queryInput);
  };

  generateResult() {
    const { classes, queryResult, settings } = this.props;
    const { docs } = queryResult;

    const MAX_BODY_LENGH = 500;
    return (docs || []).map(doc => {
      const body = doc.fields[settings.bodyField];
      const title = doc.fields[settings.titleField];
      const link = doc.fields[settings.linkField];
      return (
        <Card key={doc.id} className={classes.resultCard}>
          <CardContent className={classes.resultCardContent}>
            <Typography className={classes.retultTitle} gutterBottom={true}>
              {link ? <a href={link}>{title}</a> : title}
            </Typography>
            <Typography className={classes.retultBody}>
              {body && body.length > MAX_BODY_LENGH ? `${body.slice(0, MAX_BODY_LENGH)} ...` : body}
            </Typography>
          </CardContent>
        </Card>
      );
    });
  }

  render(): JSX.Element {
    const { classes, queryInput, querying } = this.props;

    const progressClasses = classnames(classes.progress, {
      querying,
    });
    return (
      <div className={classes.root}>
        <div className={classes.inputContainer}>
          <InputBase
            className={classes.textInput}
            margin="none"
            value={queryInput}
            onChange={this.onInputChange}
            onKeyDown={this.onInputKeyDown}
          />
          <IconButton
            className={classes.iconButton}
            aria-label="Search"
            color={!queryInput ? 'default' : 'primary'}
            onClick={this.onSearchClick}
          >
            <SearchIcon />
          </IconButton>
        </div>
        {this.generateResult()}
        <LinearProgress className={progressClasses} variant="query" />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles, { withTheme: true })(Search));
