import { grey } from '@material-ui/core/colors';
import {
  createStyles,
  Card,
  CardContent,
  Fab,
  IconButton,
  InputBase,
  LinearProgress,
  Theme,
  Typography,
  WithStyles,
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon, Search as SearchIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import actions from '../actions/actions';
import { UserSettings } from '../services/storage';
import { QueryInput, QueryResult } from '../../../server/services/explorer';

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
    searchIconButton: {
      padding: theme.spacing.unit,
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
    moreResultButton: {
      display: 'flex',
      padding: theme.spacing.unit * 2,
      '& button': {
        flexGrow: 1,
        boxShadow: 'none',
        border: `1px solid ${grey[300]}`,
        color: grey[700],
        backgroundColor: 'transparent',
        '& > span': {
          textTransform: 'none',
          '& p': {
            flexGrow: 1,
            color: 'inherit',
          },
          '& .hidden': {
            visibility: 'hidden',
          },
        },
      },
    },
    progress: {
      margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 6}px`,
      display: 'none',
      '&.loading': {
        display: 'block',
      },
    },
  });

interface Props extends WithStyles<typeof styles> {
  settings: UserSettings;
  input: QueryInput;
  result: QueryResult;
  isQuerying: boolean;
  setInputText: (text: string) => void;
  query: (q: string, page: number, count: number) => void;
  clearResult: () => void;
}

const mapStateToProps = (state: Props) => ({
  settings: state.settings,
  input: state.input,
  result: state.result,
  isQuerying: state.isQuerying,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actions, dispatch);

class Search extends Component<Props> {
  onInputTextChange = e => {
    this.props.setInputText(e.currentTarget.value);
  };

  onInputKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      this.onSearchClick();
    }
  };

  onSearchClick = () => {
    this.props.clearResult();

    const { text, count } = this.props.input;
    this.props.query(text, 0, count);
  };

  onMoreResultsClick = () => {
    const { text, page, count } = this.props.input;
    this.props.query(text, page + 1, count);
  };

  generateResult(): JSX.Element {
    const { classes, settings, isQuerying } = this.props;
    const { page, count } = this.props.input;
    const { numFound, docs } = this.props.result;

    const MAX_BODY_LENGH = 500;
    const resultDocCards = docs.map(doc => {
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

    const moreResultsButton =
      !isQuerying && docs.length && (page + 1) * count < numFound ? (
        <div className={classes.moreResultButton}>
          <Fab variant="extended" aria-label="More results" onClick={this.onMoreResultsClick}>
            <ExpandMoreIcon />
            <Typography>More results</Typography>
            <ExpandMoreIcon className="hidden" />
          </Fab>
        </div>
      ) : null;

    return (
      <div>
        {resultDocCards}
        {moreResultsButton}
      </div>
    );
  }

  render(): JSX.Element {
    const { classes, input, isQuerying } = this.props;

    const progressClasses = classnames(classes.progress, {
      loading: isQuerying,
    });
    return (
      <div className={classes.root}>
        <div className={classes.inputContainer}>
          <InputBase
            className={classes.textInput}
            margin="none"
            value={input.text}
            onChange={this.onInputTextChange}
            onKeyPress={this.onInputKeyPress}
          />
          <IconButton
            className={classes.searchIconButton}
            aria-label="Search"
            color={!input.text ? 'default' : 'primary'}
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
