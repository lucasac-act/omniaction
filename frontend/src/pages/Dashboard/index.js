import React, { useContext, useState, useEffect } from "react";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import CallIcon from "@material-ui/icons/Call";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import TimerIcon from '@material-ui/icons/Timer';
import FilterListIcon from '@material-ui/icons/FilterList';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';

import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";

import ButtonWithSpinner from "../../components/ButtonWithSpinner";

import TableAttendantsStatus from "../../components/Dashboard/TableAttendantsStatus";
import { isArray } from "lodash";

import useDashboard from "../../hooks/useDashboard";
import useContacts from "../../hooks/useContacts";
import { ChatsUser } from "./ChartsUser"

import { isEmpty } from "lodash";
import moment from "moment";
import { ChartsDate } from "./ChartsDate";
import { i18n } from "../../translate/i18n";

const useStyles = makeStyles((theme) => ({
  statsGrid: {
    marginBottom: theme.spacing(4),
  },
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    background: theme.palette.type === 'dark' 
      ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
      : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    minHeight: '100vh',
  },
  dashboardHeader: {
    marginBottom: theme.spacing(4),
    textAlign: 'center',
  },
  dashboardTitle: {
    fontSize: '2.5rem',
    fontWeight: 700,
    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: theme.spacing(1),
  },
  dashboardSubtitle: {
    fontSize: '1.1rem',
    color: theme.palette.type === 'dark' ? '#b0b0b0' : '#666',
    fontWeight: 300,
  },
  statsCard: {
    height: '100%',
    borderRadius: 16,
    boxShadow: theme.palette.type === 'dark' 
      ? '0 8px 32px rgba(0, 0, 0, 0.4)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    position: 'relative',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: theme.palette.type === 'dark' 
        ? '0 16px 48px rgba(0, 0, 0, 0.6)'
        : '0 16px 48px rgba(0, 0, 0, 0.2)',
    },
  },
  cardInTalk: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
  },
  cardWaiting: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: '#fff',
  },
  cardFinished: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: '#fff',
  },
  cardNewContacts: {
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    color: '#fff',
  },
  cardAvgTalkTime: {
    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    color: '#fff',
  },
  cardAvgWaitTime: {
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    color: '#333',
  },
  cardContent: {
    padding: theme.spacing(3),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    margin: 0,
    opacity: 0.9,
  },
  cardIcon: {
    fontSize: '2.5rem',
    opacity: 0.8,
  },
  cardValue: {
    fontSize: '2.5rem',
    fontWeight: 700,
    margin: 0,
    lineHeight: 1,
  },
  cardUnit: {
    fontSize: '1rem',
    fontWeight: 400,
    opacity: 0.8,
    marginLeft: theme.spacing(0.5),
  
  },
  filtersSection: {
    background: theme.palette.type === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: theme.spacing(3),
    marginBottom: theme.spacing(4),
    backdropFilter: 'blur(10px)',
    border: theme.palette.type === 'dark' 
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(255, 255, 255, 0.3)',
  },
  filtersTitle: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    fontSize: '1.2rem',
    fontWeight: 600,
    color: theme.palette.type === 'dark' ? '#fff' : '#333',
  },
  filterIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  selectContainer: {
    width: "100%",
    textAlign: "left",
  },
  formControl: {
    minWidth: 200,
    '& .MuiOutlinedInput-root': {
      borderRadius: 12,
      backgroundColor: theme.palette.type === 'dark' 
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(255, 255, 255, 0.8)',
    },
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 12,
      backgroundColor: theme.palette.type === 'dark' 
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(255, 255, 255, 0.8)',
    },
  },
  filterButton: {
    borderRadius: 12,
    padding: theme.spacing(1.5, 3),
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '1rem',
    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
    '&:hover': {
      background: 'linear-gradient(45deg, #5a6fd8 0%, #6a4190 100%)',
      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
    },
  },
  chartsSection: {
    marginTop: theme.spacing(4),
  },
  chartCard: {
    borderRadius: 16,
    boxShadow: theme.palette.type === 'dark' 
      ? '0 8px 32px rgba(0, 0, 0, 0.4)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)',
    background: theme.palette.type === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    border: theme.palette.type === 'dark' 
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(255, 255, 255, 0.3)',
  },
  chartTitle: {
    padding: theme.spacing(3),
    borderBottom: `1px solid ${theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
    fontSize: '1.3rem',
    fontWeight: 600,
    color: theme.palette.type === 'dark' ? '#fff' : '#333',
  },
  chartContent: {
    padding: theme.spacing(3),
  },
  alignRight: {
    textAlign: "right",
  },
  fullWidth: {
    width: "100%",
  },
  fixedHeightPaper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    height: 240,
    overflowY: "auto",
    ...theme.scrollbarStyles,
  },
  fixedHeightPaper2: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const [counters, setCounters] = useState({});
  const [attendants, setAttendants] = useState([]);
  const [period, setPeriod] = useState(0);
  const [filterType, setFilterType] = useState(1);
  const [dateFrom, setDateFrom] = useState(moment("1", "D").format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(moment().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);
  const { find } = useDashboard();

  useEffect(() => {
    async function firstLoad() {
      await fetchData();
    }
    setTimeout(() => {
      firstLoad();
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
    async function handleChangePeriod(value) {
    setPeriod(value);
  }

  async function handleChangeFilterType(value) {
    setFilterType(value);
    if (value === 1) {
      setPeriod(0);
    } else {
      setDateFrom("");
      setDateTo("");
    }
  }

  async function fetchData() {
    setLoading(true);

    let params = {};

    if (period > 0) {
      params = {
        days: period,
      };
    }

    if (!isEmpty(dateFrom) && moment(dateFrom).isValid()) {
      params = {
        ...params,
        date_from: moment(dateFrom).format("YYYY-MM-DD"),
      };
    }

    if (!isEmpty(dateTo) && moment(dateTo).isValid()) {
      params = {
        ...params,
        date_to: moment(dateTo).format("YYYY-MM-DD"),
      };
    }

    if (Object.keys(params).length === 0) {
      toast.error(i18n.t("dashboard.toasts.selectFilterError"));
      setLoading(false);
      return;
    }

    const data = await find(params);

    setCounters(data.counters);
    if (isArray(data.attendants)) {
      setAttendants(data.attendants);
    } else {
      setAttendants([]);
    }

    setLoading(false);
  }

  function formatTime(minutes) {
    return moment()
      .startOf("day")
      .add(minutes, "minutes")
      .format("HH[h] mm[m]");
  }

    const GetContacts = (all) => {
    let props = {};
    if (all) {
      props = {};
    }
    const { count } = useContacts(props);
    return count;
  };
  
    function renderFilters() {
    if (filterType === 1) {
      return (
        <>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label={i18n.t("dashboard.filters.initialDate")}
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={classes.textField}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label={i18n.t("dashboard.filters.finalDate")}
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={classes.textField}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </>
      );
    } else {
      return (
        <Grid item xs={12} sm={6} md={3}>
          <FormControl className={classes.formControl} fullWidth>
            <InputLabel id="period-selector-label">
              {i18n.t("dashboard.periodSelect.title")}
            </InputLabel>
            <Select
              labelId="period-selector-label"
              id="period-selector"
              value={period}
              onChange={(e) => handleChangePeriod(e.target.value)}
            >
              <MenuItem value={0}>{i18n.t("dashboard.periodSelect.options.none")}</MenuItem>
              <MenuItem value={3}>{i18n.t("dashboard.periodSelect.options.last3")}</MenuItem>
              <MenuItem value={7}>{i18n.t("dashboard.periodSelect.options.last7")}</MenuItem>
              <MenuItem value={15}>{i18n.t("dashboard.periodSelect.options.last15")}</MenuItem>
              <MenuItem value={30}>{i18n.t("dashboard.periodSelect.options.last30")}</MenuItem>
              <MenuItem value={60}>{i18n.t("dashboard.periodSelect.options.last60")}</MenuItem>
              <MenuItem value={90}>{i18n.t("dashboard.periodSelect.options.last90")}</MenuItem>
            </Select>
            <FormHelperText>{i18n.t("dashboard.periodSelect.helper")}</FormHelperText>
          </FormControl>
        </Grid>
      );
    }
  }

  return (
    <div>
      <Container maxWidth="lg" className={classes.container}>
        {/* Header do Dashboard */}
        <Box className={classes.dashboardHeader}>
          <Typography className={classes.dashboardTitle}>
            Dashboard
          </Typography>
          <Typography className={classes.dashboardSubtitle}>
            {i18n.t("dashboard.subtitle", "Visão geral dos seus atendimentos e métricas")}
          </Typography>
        </Box>

        <Grid container spacing={3} className={classes.statsGrid}>
          {/* EM ATENDIMENTO */}
          <Grid item xs={12} sm={6} md={4}>
            <Card className={`${classes.statsCard} ${classes.cardInTalk}`}>
              <CardContent className={classes.cardContent}>
                <div className={classes.cardHeader}>
                  <Typography className={classes.cardTitle}>
                    {i18n.t("dashboard.counters.inTalk")}
                  </Typography>
                  <CallIcon className={classes.cardIcon} />
                </div>
                <Typography className={classes.cardValue}>
                  {counters.supportHappening || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* AGUARDANDO */}
          <Grid item xs={12} sm={6} md={4}>
            <Card className={`${classes.statsCard} ${classes.cardWaiting}`}>
              <CardContent className={classes.cardContent}>
                <div className={classes.cardHeader}>
                  <Typography className={classes.cardTitle}>
                    {i18n.t("dashboard.counters.waiting")}
                  </Typography>
                  <HourglassEmptyIcon className={classes.cardIcon} />
                </div>
                <Typography className={classes.cardValue}>
                  {counters.supportPending || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* FINALIZADOS */}
          <Grid item xs={12} sm={6} md={4}>
            <Card className={`${classes.statsCard} ${classes.cardFinished}`}>
              <CardContent className={classes.cardContent}>
                <div className={classes.cardHeader}>
                  <Typography className={classes.cardTitle}>
                    {i18n.t("dashboard.counters.finished")}
                  </Typography>
                  <CheckCircleIcon className={classes.cardIcon} />
                </div>
                <Typography className={classes.cardValue}>
                  {counters.supportFinished || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* NOVOS CONTATOS */}
          <Grid item xs={12} sm={6} md={4}>
            <Card className={`${classes.statsCard} ${classes.cardNewContacts}`}>
              <CardContent className={classes.cardContent}>
                <div className={classes.cardHeader}>
                  <Typography className={classes.cardTitle}>
                    {i18n.t("dashboard.counters.newContacts")}
                  </Typography>
                  <GroupAddIcon className={classes.cardIcon} />
                </div>
                <Typography className={classes.cardValue}>
                  {GetContacts(true) || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* T.M. DE ATENDIMENTO */}
          <Grid item xs={12} sm={6} md={4}>
            <Card className={`${classes.statsCard} ${classes.cardAvgTalkTime}`}>
              <CardContent className={classes.cardContent}>
                <div className={classes.cardHeader}>
                  <Typography className={classes.cardTitle}>
                    {i18n.t("dashboard.counters.averageTalkTime")}
                  </Typography>
                  <AccessAlarmIcon className={classes.cardIcon} />
                </div>
                <Typography className={classes.cardValue}>
                  {formatTime(counters.avgSupportTime || 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* T.M. DE ESPERA */}
          <Grid item xs={12} sm={6} md={4}>
            <Card className={`${classes.statsCard} ${classes.cardAvgWaitTime}`}>
              <CardContent className={classes.cardContent}>
                <div className={classes.cardHeader}>
                  <Typography className={classes.cardTitle}>
                    {i18n.t("dashboard.counters.averageWaitTime")}
                  </Typography>
                  <TimerIcon className={classes.cardIcon} />
                </div>
                <Typography className={classes.cardValue}>
                  {formatTime(counters.avgWaitTime || 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Seção de Filtros */}
        <Box className={classes.filtersSection}>
          <Typography className={classes.filtersTitle}>
            <FilterListIcon className={classes.filterIcon} />
            {i18n.t("dashboard.filters.title", "Filtros de Período")}
          </Typography>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl className={classes.formControl} fullWidth>
                <InputLabel id="filter-type-label">
                  {i18n.t("dashboard.filters.filterType.title")}
                </InputLabel>
                <Select
                  labelId="filter-type-label"
                  value={filterType}
                  onChange={(e) => handleChangeFilterType(e.target.value)}
                >
                  <MenuItem value={1}>{i18n.t("dashboard.filters.filterType.options.perDate")}</MenuItem>
                  <MenuItem value={2}>{i18n.t("dashboard.filters.filterType.options.perPeriod")}</MenuItem>
                </Select>
                <FormHelperText>
                  {i18n.t("dashboard.filters.filterType.helper")}
                </FormHelperText>
              </FormControl>
            </Grid>

            {renderFilters()}

            <Grid item xs={12} sm={6} md={3}>
              <ButtonWithSpinner
                loading={loading}
                onClick={() => fetchData()}
                variant="contained"
                className={classes.filterButton}
                fullWidth
              >
                {i18n.t("dashboard.buttons.filter")}
              </ButtonWithSpinner>
            </Grid>
          </Grid>
        </Box>

        {/* USUARIOS ONLINE */}
        {attendants.length > 0 && (
          <Grid item xs={12}>
            <Card className={classes.chartCard}>
              <Typography className={classes.chartTitle}>
                {i18n.t("dashboard.attendants.title", "Usuários Online")}
              </Typography>
              <div className={classes.chartContent}>
                <TableAttendantsStatus
                  attendants={attendants}
                  loading={loading}
                />
              </div>
            </Card>
          </Grid>
        )}

        {/* Seção de Gráficos */}
        <Box className={classes.chartsSection}>
          <Grid container spacing={3}>
            {/* TOTAL DE ATENDIMENTOS POR USUARIO */}
            <Grid item xs={12} md={6}>
              <Card className={classes.chartCard}>
                <Typography className={classes.chartTitle}>
                  <TrendingUpIcon style={{ marginRight: 8, verticalAlign: 'middle' }} />
                  {i18n.t("dashboard.charts.attendanceByUser", "Atendimentos por Usuário")}
                </Typography>
                <div className={classes.chartContent}>
                  <ChatsUser />
                </div>
              </Card>
            </Grid>

            {/* TOTAL DE ATENDIMENTOS */}
            <Grid item xs={12} md={6}>
              <Card className={classes.chartCard}>
                <Typography className={classes.chartTitle}>
                  <TrendingUpIcon style={{ marginRight: 8, verticalAlign: 'middle' }} />
                  {i18n.t("dashboard.charts.totalAttendance", "Total de Atendimentos")}
                </Typography>
                <div className={classes.chartContent}>
                  <ChartsDate />
                </div>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default Dashboard;
