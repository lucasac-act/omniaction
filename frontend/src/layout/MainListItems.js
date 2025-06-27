import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link as RouterLink, useHistory, useLocation } from "react-router-dom";
import { Home as HomeIcon, Settings as SettingsIcon } from '@material-ui/icons';
import { Menu as MenuIcon } from '@material-ui/icons';

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import { Badge, Collapse, List } from "@material-ui/core";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import ContactPhoneOutlinedIcon from "@material-ui/icons/ContactPhoneOutlined";
import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import CodeRoundedIcon from "@material-ui/icons/CodeRounded";
import EventIcon from "@material-ui/icons/Event";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PeopleIcon from "@material-ui/icons/People";
import ListIcon from "@material-ui/icons/ListAlt";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import ForumIcon from "@material-ui/icons/Forum";
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import RotateRight from "@material-ui/icons/RotateRight";
import { i18n } from "../translate/i18n";
import { WhatsAppsContext } from "../context/WhatsApp/WhatsAppsContext";
import { AuthContext } from "../context/Auth/AuthContext";
import LoyaltyRoundedIcon from '@material-ui/icons/LoyaltyRounded';
import { Can } from "../components/Can";
import { SocketContext } from "../context/Socket/SocketContext";
import { isArray } from "lodash";
import TableChartIcon from '@material-ui/icons/TableChart';
import api from "../services/api";
import BorderColorIcon from '@material-ui/icons/BorderColor';
import ToDoList from "../pages/ToDoList/";
import toastError from "../errors/toastError";
import { makeStyles } from "@material-ui/core/styles";
import { AccountTree, AllInclusive, AttachFile, BlurCircular, Chat, DeviceHubOutlined, Schedule } from '@material-ui/icons';
import usePlans from "../hooks/usePlans";
import Typography from "@material-ui/core/Typography";
import { ShapeLine } from "@mui/icons-material";
import { Avatar, IconButton, Tooltip } from "@material-ui/core";
import clsx from "clsx";
import FolderIcon from '@material-ui/icons/Folder';
import OnlineIcon from '@material-ui/icons/FiberManualRecord';

const useStyles = makeStyles((theme) => ({
  listItem: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    color: theme.palette.drawerText,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    [theme.breakpoints.down("sm")]: {
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(1.5),
    },
  },
  listItemIcon: {
    color: theme.palette.drawerTextSecondary,
    minWidth: '36px',
    [theme.breakpoints.down("sm")]: {
      minWidth: '32px',
    },
  },
  listItemText: {
    [theme.breakpoints.down("sm")]: {
      fontSize: '0.875rem',
    },
  },
  listSubheader: {
    color: theme.palette.drawerTextSecondary,
    fontSize: '0.875rem',
    paddingLeft: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      fontSize: '0.8rem',
      paddingLeft: theme.spacing(1.5),
    },
  },
  drawerPaper: {
    backgroundColor: theme.palette.drawerBackground,
  },
  nested: {
    paddingLeft: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      paddingLeft: theme.spacing(3),
    },
  },
  activeItem: {
    backgroundColor: theme.palette.action.selected,
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3),
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
    borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
    borderRadius: '0 0 16px 16px',
    color: theme.palette.drawerText,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
      pointerEvents: 'none',
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
  },
  avatar: {
    marginRight: theme.spacing(2),
    width: theme.spacing(6),
    height: theme.spacing(6),
    border: '3px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    position: 'relative',
    zIndex: 1,
    [theme.breakpoints.down("sm")]: {
      marginRight: theme.spacing(1.5),
      width: theme.spacing(5),
      height: theme.spacing(5),
    },
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    zIndex: 1,
    position: 'relative',
  },
  userName: {
    fontWeight: 600,
    fontSize: '1.1rem',
    color: '#fff',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    marginBottom: theme.spacing(0.5),
  },
  userRole: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: 400,
    textTransform: 'capitalize',
  },
     statusIndicator: {
     width: 12,
     height: 12,
     borderRadius: '50%',
     backgroundColor: '#4caf50',
     border: '2px solid #fff',
     position: 'absolute',
     top: theme.spacing(3.5),
     left: theme.spacing(6.5),
     boxShadow: '0 0 10px rgba(76, 175, 80, 0.5)',
     animation: '$pulse 2s infinite',
     [theme.breakpoints.down("sm")]: {
       top: theme.spacing(3),
       left: theme.spacing(5.5),
       width: 10,
       height: 10,
     },
   },
   '@keyframes pulse': {
     '0%': {
       boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.7)',
     },
     '70%': {
       boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)',
     },
     '100%': {
       boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)',
     },
   },
   avatarContainer: {
     position: 'relative',
     transition: 'transform 0.2s ease-in-out',
     '&:hover': {
       transform: 'scale(1.05)',
     },
   },
  collapsedText: {
    display: 'none',
    [theme.breakpoints.down("sm")]: {
      display: 'block',
    },
  },
}));

// Função utilitária para renderizar item de menu com ícone e texto condicional
function ListItemLinkIcon({ to, primary, icon, collapsed, className, ...rest }) {
  const classes = useStyles();
  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );
  return (
    <li>
      <ListItem button dense component={renderLink} className={className} {...rest}>
        {collapsed ? (
          <ListItemIcon className={classes.listItemIcon}>{icon}</ListItemIcon>
        ) : (
          <ListItemText primary={primary} primaryTypographyProps={{ style: { color: '#fff' } }} className={classes.listItemText} />
        )}
      </ListItem>
    </li>
  );
}

const reducer = (state, action) => {
  if (action.type === "LOAD_CHATS") {
    const chats = action.payload;
    const newChats = [];

    if (isArray(chats)) {
      chats.forEach((chat) => {
        const chatIndex = state.findIndex((u) => u.id === chat.id);
        if (chatIndex !== -1) {
          state[chatIndex] = chat;
        } else {
          newChats.push(chat);
        }
      });
    }

    return [...state, ...newChats];
  }

  if (action.type === "UPDATE_CHATS") {
    const chat = action.payload;
    const chatIndex = state.findIndex((u) => u.id === chat.id);

    if (chatIndex !== -1) {
      state[chatIndex] = chat;
      return [...state];
    } else {
      return [chat, ...state];
    }
  }

  if (action.type === "DELETE_CHAT") {
    const chatId = action.payload;

    const chatIndex = state.findIndex((u) => u.id === chatId);
    if (chatIndex !== -1) {
      state.splice(chatIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }

  if (action.type === "CHANGE_CHAT") {
    const changedChats = state.map((chat) => {
      if (chat.id === action.payload.chat.id) {
        return action.payload.chat;
      }
      return chat;
    });
    return changedChats;
  }
};

const MainListItems = (props) => {
  const classes = useStyles();
  const { drawerClose, collapsed } = props;
  const { whatsApps } = useContext(WhatsAppsContext);
  const { user, handleLogout } = useContext(AuthContext);
  const [connectionWarning, setConnectionWarning] = useState(false);
  const [openCampaignSubmenu, setOpenCampaignSubmenu] = useState(false);
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [showKanban, setShowKanban] = useState(false);
  const [showOpenAi, setShowOpenAi] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const location = useLocation();
  const [showSchedules, setShowSchedules] = useState(false);
  const [showInternalChat, setShowInternalChat] = useState(false);
  const [showExternalApi, setShowExternalApi] = useState(false);


  const [invisible, setInvisible] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchParam] = useState("");
  const [chats, dispatch] = useReducer(reducer, []);
  const { getPlanCompany } = usePlans();
  
  const [openFlowsSubmenu, setOpenFlowsSubmenu] = useState(false);

  const socketManager = useContext(SocketContext);

  const history = useHistory();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    async function fetchData() {
      const companyId = user.companyId;
      const planConfigs = await getPlanCompany(undefined, companyId);

      setShowCampaigns(planConfigs.plan.useCampaigns);
      setShowKanban(planConfigs.plan.useKanban);
      setShowOpenAi(planConfigs.plan.useOpenAi);
      setShowIntegrations(planConfigs.plan.useIntegrations);
      setShowSchedules(planConfigs.plan.useSchedules);
      setShowInternalChat(planConfigs.plan.useInternalChat);
      setShowExternalApi(planConfigs.plan.useExternalApi);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchChats();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketManager.getSocket(companyId);

    socket.on(`company-${companyId}-chat`, (data) => {
      if (data.action === "new-message") {
        dispatch({ type: "CHANGE_CHAT", payload: data });
      }
      if (data.action === "update") {
        dispatch({ type: "CHANGE_CHAT", payload: data });
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [socketManager]);

  useEffect(() => {
    let unreadsCount = 0;
    if (chats.length > 0) {
      for (let chat of chats) {
        for (let chatUser of chat.users) {
          if (chatUser.userId === user.id) {
            unreadsCount += chatUser.unreads;
          }
        }
      }
    }
    if (unreadsCount > 0) {
      setInvisible(false);
    } else {
      setInvisible(true);
    }
  }, [chats, user.id]);

  useEffect(() => {
    if (localStorage.getItem("cshow")) {
      setShowCampaigns(true);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (whatsApps.length > 0) {
        const offlineWhats = whatsApps.filter((whats) => {
          return (
            whats.status === "qrcode" ||
            whats.status === "PAIRING" ||
            whats.status === "DISCONNECTED" ||
            whats.status === "TIMEOUT" ||
            whats.status === "OPENING"
          );
        });
        if (offlineWhats.length > 0) {
          setConnectionWarning(true);
        } else {
          setConnectionWarning(false);
        }
      }
    }, 2000);
    return () => clearTimeout(delayDebounceFn);
  }, [whatsApps]);

  const fetchChats = async () => {
    try {
      const { data } = await api.get("/chats/", {
        params: { searchParam, pageNumber },
      });
      dispatch({ type: "LOAD_CHATS", payload: data.records });
    } catch (err) {
      toastError(err);
    }
  };

  const handleClickLogout = () => {
    //handleCloseMenu();
    handleLogout();
  };

  return (
    <div onClick={drawerClose} className={classes.drawerPaper}>
      <div className={classes.avatarSection}>
        <Tooltip title={collapsed ? `${user.name} - Online` : ''} placement="right">
          <div className={classes.avatarContainer}>
            <Avatar className={classes.avatar}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <div className={classes.statusIndicator}></div>
          </div>
        </Tooltip>
        {!collapsed && (
          <div className={classes.userInfo}>
            <Typography className={classes.userName} variant="body1">
              {user.name || 'Usuário'}
            </Typography>
            <Typography className={classes.userRole} variant="caption">
              {user.profile === 'admin' ? 'Administrador' : 
               user.profile === 'super' ? 'Super Admin' : 
               user.profile === 'user' ? 'Usuário' : 'Operador'}
            </Typography>
          </div>
        )}
      </div>

      <Can
        role={user.profile}
        perform="dashboard:view"
        yes={() => (
          <ListItemLinkIcon
            to="/"
            primary="Dashboard"
            icon={<DashboardOutlinedIcon />}
            collapsed={collapsed}
            className={clsx(classes.listItem, location.pathname === '/' && classes.activeItem)}
          />
        )}
      />

      <ListItemLinkIcon
        to="/tickets"
        primary={i18n.t("mainDrawer.listItems.tickets")}
        icon={<ForumIcon />}
        collapsed={collapsed}
        className={classes.listItem}
      />
	  
	{showKanban && (  
	  <ListItemLinkIcon
        to="/kanban"
        primary="Kanban"
        icon={<TableChartIcon />}
        collapsed={collapsed}
        className={classes.listItem}
      />
	  )}

      <ListItemLinkIcon
        to="/quick-messages"
        primary={i18n.t("mainDrawer.listItems.quickMessages")}
        icon={<FlashOnIcon />}
        collapsed={collapsed}
        className={classes.listItem}
      />
	  
	  <ListItemLinkIcon
        to="/todolist"
        primary={i18n.t("mainDrawer.listItems.tasks")}
        icon={<ListIcon />}
        collapsed={collapsed}
        className={classes.listItem}
      />

      <ListItemLinkIcon
        to="/contacts"
        primary={i18n.t("mainDrawer.listItems.contacts")}
        icon={<PeopleAltOutlinedIcon />}
        collapsed={collapsed}
        className={classes.listItem}
      />

      <ListItemLinkIcon
        to="/schedules"
        primary={i18n.t("mainDrawer.listItems.schedules")}
        icon={<EventAvailableIcon />}
        collapsed={collapsed}
        className={classes.listItem}
      />

      <ListItemLinkIcon
        to="/tags"
        primary={i18n.t("mainDrawer.listItems.tags")}
        icon={<LocalOfferIcon />}
        collapsed={collapsed}
        className={classes.listItem}
      />

      <ListItemLinkIcon
        to="/chats"
        primary={i18n.t("mainDrawer.listItems.chats")}
        icon={<Chat />}
        collapsed={collapsed}
        className={classes.listItem}
      />

      <ListItemLinkIcon
        to="/helps"
        primary={i18n.t("mainDrawer.listItems.helps")}
        icon={<HelpOutlineIcon />}
        collapsed={collapsed}
        className={classes.listItem}
      />

      <Can
        role={user.profile}
        perform="drawer-admin-items:view"
        yes={() => (
          <>
            <Divider />
            <ListSubheader className={classes.listSubheader}>
              {i18n.t("mainDrawer.listItems.administration")}
            </ListSubheader>
			
            {showCampaigns && (
              <>
                <ListItem
                  button
                  onClick={() => setOpenCampaignSubmenu((prev) => !prev)}
                  className={classes.listItem}
                  style={{ color: 'inherit' }}
                >
                  {collapsed ? (
                    <ListItemIcon className={classes.listItemIcon}><FolderIcon /></ListItemIcon>
                  ) : (
                    <ListItemText
                      primary={i18n.t("mainDrawer.listItems.campaigns")}
                      primaryTypographyProps={{ style: { color: '#fff', fontWeight: 500 } }}
                    />
                  )}
                  {!collapsed && (openCampaignSubmenu ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                </ListItem>
                <Collapse
                  in={openCampaignSubmenu}
                  timeout="auto"
                  unmountOnExit
                  className={classes.nested}
                >
                  <List component="div" disablePadding>
                    <ListItem
                      button
                      onClick={() => history.push("/campaigns")}
                      className={classes.listItem}
                      style={{ color: 'inherit' }}
                    >
                      <ListItemText primary="Listagem" primaryTypographyProps={{ style: { color: '#fff' } }} />
                    </ListItem>
                    <ListItem
                      button
                      onClick={() => history.push("/contact-lists")}
                      className={classes.listItem}
                      style={{ color: 'inherit' }}
                    >
                      <ListItemText primary="Listas de Contatos" primaryTypographyProps={{ style: { color: '#fff' } }} />
                    </ListItem>
                    <ListItem
                      button
                      onClick={() => history.push("/campaigns-config")}
                      className={classes.listItem}
                      style={{ color: 'inherit' }}
                    >
                      <ListItemText primary="Configurações" primaryTypographyProps={{ style: { color: '#fff' } }} />
                    </ListItem>
                  </List>
                </Collapse>
                {/* Flow builder */}
                <ListItem
                  button
                  onClick={() => setOpenFlowsSubmenu((prev) => !prev)}
                  className={classes.listItem}
                  style={{ color: 'inherit' }}
                >
                  {collapsed ? (
                    <ListItemIcon className={classes.listItemIcon}><DeviceHubOutlined /></ListItemIcon>
                  ) : (
                    <ListItemText
                      primary={i18n.t("mainDrawer.listItems.flows")}
                      primaryTypographyProps={{ style: { color: '#fff', fontWeight: 500 } }}
                    />
                  )}
                  {!collapsed && (openFlowsSubmenu ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                </ListItem>
                <Collapse
                  style={{ paddingLeft: 15 }}
                  in={openFlowsSubmenu}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    <ListItem
                      onClick={() => history.push("/phrase-lists")}
                      button
                      className={classes.listItem}
                      style={{ color: 'inherit' }}
                    >
                      <ListItemText primary="Campanha" primaryTypographyProps={{ style: { color: '#fff' } }} />
                    </ListItem>
                    <ListItem
                      onClick={() => history.push("/flowbuilders")}
                      button
                      className={classes.listItem}
                      style={{ color: 'inherit' }}
                    >
                      <ListItemText primary="Conversa" primaryTypographyProps={{ style: { color: '#fff' } }} />
                    </ListItem>
                  </List>
                </Collapse>
              </>
            )}

            {user.super && (
              <ListItemLinkIcon
                to="/announcements"
                primary={i18n.t("mainDrawer.listItems.annoucements")}
                icon={<AnnouncementIcon />}
                collapsed={collapsed}
              />
            )}
            {showOpenAi && (
              <ListItemLinkIcon
                to="/prompts"
                primary={i18n.t("mainDrawer.listItems.prompts")}
                icon={<CodeRoundedIcon />}
                collapsed={collapsed}
              />
            )}

            {showIntegrations && (
              <ListItemLinkIcon
                to="/queue-integration"
                primary={i18n.t("mainDrawer.listItems.queueIntegration")}
                icon={<SyncAltIcon />}
                collapsed={collapsed}
              />
            )}
            <ListItemLinkIcon
              to="/connections"
              primary={i18n.t("mainDrawer.listItems.connections")}
              icon={<PeopleIcon />}
              collapsed={collapsed}
            />
            <ListItemLinkIcon
              to="/files"
              primary={i18n.t("mainDrawer.listItems.files")}
              icon={<AllInclusive />}
              collapsed={collapsed}
            />
            <ListItemLinkIcon
              to="/queues"
              primary={i18n.t("mainDrawer.listItems.queues")}
              icon={<LocalAtmIcon />}
              collapsed={collapsed}
            />
            <ListItemLinkIcon
              to="/users"
              primary={i18n.t("mainDrawer.listItems.users")}
              icon={<PeopleIcon />}
              collapsed={collapsed}
            />
            {showExternalApi && (
              <ListItemLinkIcon
                to="/messages-api"
                primary={i18n.t("mainDrawer.listItems.messagesAPI")}
                icon={<BorderColorIcon />}
                collapsed={collapsed}
              />
            )}
            <ListItemLinkIcon
              to="/financeiro"
              primary={i18n.t("mainDrawer.listItems.financeiro")}
              icon={<LocalAtmIcon />}
              collapsed={collapsed}
            />

            <ListItemLinkIcon
              to="/settings"
              primary={i18n.t("mainDrawer.listItems.settings")}
              icon={<SettingsOutlinedIcon />}
              collapsed={collapsed}
              className={clsx(classes.listItem, location.pathname === '/settings' && classes.activeItem)}
            />
			
			
            {!collapsed && <React.Fragment>
              <Divider />
              {/* 
              // IMAGEM NO MENU
              <Hidden only={['sm', 'xs']}>
                <img style={{ width: "100%", padding: "10px" }} src={logo} alt="image" />            
              </Hidden> 
              */}
              <Typography style={{ fontSize: "12px", padding: "10px", textAlign: "right", fontWeight: "bold" }}>
                8.0.1
              </Typography>
            </React.Fragment>
            }
			
          </>
        )}
      />
    </div>
  );
};

export default MainListItems;
