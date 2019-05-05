import { createStyles, LinearProgress, Theme, WithStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import SearchInput from './SearchInput';
import SearchResult from './SearchResult';
import { Settings } from '../reducers/app/types';
import { State } from '../reducers/store';

const styles = (theme: Theme) =>
  createStyles({
    container: {
      padding: `${theme.spacing.unit * 2}px`,
    },
    progress: {
      margin: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 6}px`,
      display: 'none',
      '&.loading': {
        display: 'block',
      },
    },
  });

interface Props extends WithStyles<typeof styles> {
  settings: Settings;
  querying: boolean;
}

const mapStateToProps = (state: State) => ({
  settings: state.app.settings,
  querying: state.explorer.querying,
});

// tslint:disable-next-line: variable-name
const Search = (props: Props): JSX.Element => {
  const { classes, querying } = props;

  const progressClasses = classnames(classes.progress, {
    loading: querying,
  });
  return (
    <div className={classes.container}>
      <SearchInput />
      <SearchResult />
      <LinearProgress className={progressClasses} variant="query" />
    </div>
  );
};

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Search));
