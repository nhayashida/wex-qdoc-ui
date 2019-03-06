import { grey } from '@material-ui/core/colors';
import {
  createStyles,
  Card,
  CardContent,
  Fab,
  Theme,
  Typography,
  WithStyles,
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import actions from '../actions/actions';

const styles = (theme: Theme) =>
  createStyles({
    resultContainer: {
      marginTop: theme.spacing.unit * 2,
    },
    resultCard: {
      boxShadow: '0 1px 6px rgba(32, 33, 36, 0.28)',
      borderRadius: theme.typography.pxToRem(8),
      backgroundColor: 'transparent',
      marginBottom: theme.spacing.unit * 1.5,
    },
    resultCardContent: {
      '&:last-child': {
        paddingBottom: theme.spacing.unit * 2,
      },
    },
    resultTitle: {
      fontSize: theme.typography.pxToRem(16),
    },
    resultBody: {
      fontSize: theme.typography.pxToRem(12),
      color: grey[700],
    },
    moreResultButton: {
      display: 'flex',
      padding: theme.spacing.unit,
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
  });

interface Props extends WithStyles<typeof styles> {
  settings: UserSettings;
  input: Explorer.QueryInput;
  result: Explorer.QueryResult;
  querying: boolean;
  query: (q: string, page: number, count: number) => void;
}

const mapStateToProps = (state: Props) => ({
  settings: state.settings,
  input: state.input,
  result: state.result,
  querying: state.querying,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actions, dispatch);

const MAX_BODY_LENGH = 500;

// tslint:disable-next-line: variable-name
const SearchResult = (props: Props): JSX.Element => {
  const { classes, settings, input, result, querying, query } = props;
  const { text, page, count } = input;
  const { numFound, docs } = result;

  const resultDocCards = docs.map(doc => {
    const body = doc.fields[settings.bodyField];
    const title = doc.fields[settings.titleField];
    const link = doc.fields[settings.linkField];
    return (
      <Card key={doc.id} className={classes.resultCard}>
        <CardContent className={classes.resultCardContent}>
          <Typography className={classes.resultTitle} gutterBottom={true}>
            {link ? <a href={link}>{title}</a> : title}
          </Typography>
          <Typography className={classes.resultBody}>
            {body && body.length > MAX_BODY_LENGH ? `${body.slice(0, MAX_BODY_LENGH)} ...` : body}
          </Typography>
        </CardContent>
      </Card>
    );
  });

  const onMoreResultsClick = () => {
    query(text, page + 1, count);
  };

  const moreResultsButton =
    !querying && docs.length && (page + 1) * count < numFound ? (
      <div className={classes.moreResultButton}>
        <Fab variant="extended" aria-label="More results" onClick={onMoreResultsClick}>
          <ExpandMoreIcon />
          <Typography>More results</Typography>
          <ExpandMoreIcon className="hidden" />
        </Fab>
      </div>
    ) : null;

  return (
    <div className={classes.resultContainer}>
      {resultDocCards}
      {moreResultsButton}
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles, { withTheme: true })(SearchResult));
