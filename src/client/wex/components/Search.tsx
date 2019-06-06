import LinearProgress from '@material-ui/core/LinearProgress';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';
import SearchInput from './SearchInput';
import SearchResult from './SearchResult';
import { State } from '../reducers/store';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: `${theme.spacing(2)}px`,
  },
  progress: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(6)}px`,
    display: 'none',
    '&.loading': {
      display: 'block',
    },
  },
}));

interface Props {
  querying: boolean;
}

const mapStateToProps = (state: State) => ({
  querying: state.explorer.querying,
});

// tslint:disable-next-line: variable-name
const Search = (props: Props): JSX.Element => {
  const { querying } = props;

  const classes = useStyles();

  const progressClasses = clsx(classes.progress, {
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

export default connect(mapStateToProps)(Search);
