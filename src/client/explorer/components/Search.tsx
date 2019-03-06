import { createStyles, LinearProgress, Theme, WithStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import SearchInput from './SearchInput';
import SearchResult from './SearchResult';

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
  settings: UserSettings;
  querying: boolean;
}

const mapStateToProps = (state: Props) => ({
  settings: state.settings,
  querying: state.querying,
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
