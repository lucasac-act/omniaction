import React, { useState, useEffect, useRef, useContext } from "react";

import { useHistory, useParams } from "react-router-dom";
import { parseISO, format, isSameDay } from "date-fns";
import clsx from "clsx";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Badge from "@material-ui/core/Badge";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import ButtonWithSpinner from "../ButtonWithSpinner";
import MarkdownWrapper from "../MarkdownWrapper";
import { Tooltip } from "@material-ui/core";
import { AuthContext } from "../../context/Auth/AuthContext";
import toastError from "../../errors/toastError";

const useStyles = makeStyles((theme) => ({
  ticket: {
    position: "relative",
    margin: theme.spacing(0.5, 1),
    borderRadius: 12,
    transition: 'all 0.3s ease',
    background: theme.palette.type === 'dark' 
      ? 'rgba(255, 255, 255, 0.03)'
      : 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(10px)',
    border: theme.palette.type === 'dark' 
      ? '1px solid rgba(255, 255, 255, 0.05)'
      : '1px solid rgba(255, 255, 255, 0.3)',
    '&:hover': {
      background: theme.palette.type === 'dark' 
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(255, 255, 255, 0.8)',
      transform: 'translateY(-2px)',
      boxShadow: theme.palette.type === 'dark' 
        ? '0 4px 20px rgba(0, 0, 0, 0.3)'
        : '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
    '&.Mui-selected': {
      background: theme.palette.type === 'dark' 
        ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
        : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
      border: theme.palette.type === 'dark' 
        ? '1px solid rgba(102, 126, 234, 0.3)'
        : '1px solid rgba(102, 126, 234, 0.2)',
      boxShadow: theme.palette.type === 'dark' 
        ? '0 4px 20px rgba(102, 126, 234, 0.2)'
        : '0 4px 20px rgba(102, 126, 234, 0.1)',
    },
  },

  pendingTicket: {
    cursor: "unset",
    opacity: 0.7,
  },

  noTicketsDiv: {
    display: "flex",
    height: "100px",
    margin: 40,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  noTicketsText: {
    textAlign: "center",
    color: theme.palette.type === 'dark' ? '#888' : '#687992',
    fontSize: "14px",
    lineHeight: "1.4",
  },

  noTicketsTitle: {
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0px",
    color: theme.palette.type === 'dark' ? '#b0b0b0' : '#435375',
  },

  contactNameWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: 'center',
  },

  lastMessageTime: {
    justifySelf: "flex-end",
    fontSize: '0.75rem',
    color: theme.palette.type === 'dark' ? '#888' : '#999',
    fontWeight: 500,
  },

  closedBadge: {
    alignSelf: "center",
    justifySelf: "flex-end",
    marginRight: 32,
    marginLeft: "auto",
    '& .MuiBadge-badge': {
      background: theme.palette.type === 'dark' 
        ? 'linear-gradient(45deg, #ff6b6b, #ee5a24)'
        : 'linear-gradient(45deg, #667eea, #764ba2)',
      fontWeight: 600,
      fontSize: '0.7rem',
    },
  },

  contactLastMessage: {
    paddingRight: 20,
    color: theme.palette.type === 'dark' ? '#b0b0b0' : '#666',
    fontSize: '0.8rem',
    lineHeight: 1.4,
  },

  newMessagesCount: {
    alignSelf: "center",
    marginRight: 8,
    marginLeft: "auto",
    '& .MuiBadge-badge': {
      background: theme.palette.type === 'dark' 
        ? 'linear-gradient(45deg, #ff6b6b, #ee5a24)'
        : 'linear-gradient(45deg, #667eea, #764ba2)',
      fontWeight: 600,
      fontSize: '0.75rem',
    },
  },

  badgeStyle: {
    color: "white",
    background: theme.palette.type === 'dark' 
      ? 'linear-gradient(45deg, #4facfe, #00f2fe)'
      : 'linear-gradient(45deg, #667eea, #764ba2)',
  },

  acceptButton: {
    position: "absolute",
    left: "50%",
    transform: 'translateX(-50%)',
    background: theme.palette.type === 'dark' 
      ? 'linear-gradient(45deg, #4facfe, #00f2fe)'
      : 'linear-gradient(45deg, #667eea, #764ba2)',
    color: 'white',
    borderRadius: 20,
    padding: '8px 16px',
    fontSize: '0.8rem',
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    '&:hover': {
      background: theme.palette.type === 'dark' 
        ? 'linear-gradient(45deg, #3d9be8, #00d4e6)'
        : 'linear-gradient(45deg, #5a6fd8, #6a4190)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    },
  },

  ticketQueueColor: {
    flex: "none",
    width: "6px",
    height: "100%",
    position: "absolute",
    top: "0%",
    left: "0%",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
  },
}));

const TicketListItem = ({ ticket }) => {
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { ticketId } = useParams();
  const isMounted = useRef(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleAcepptTicket = async (ticket) => {
    setLoading(true);
    try {
      await api.put(`/tickets/${ticket.id}`, {
        status: "open",
        userId: user?.id,
      });
    } catch (err) {
      setLoading(false);
      toastError(err);
    }
    if (isMounted.current) {
      setLoading(false);
    }
    history.push(`/tickets/${ticket.uuid}`);
  };
  console.log("🚀 Console Log : ticket.lastMessage", ticket.lastMessage);

  const handleSelectTicket = (ticket) => {
    history.push(`/tickets/${ticket.uuid}`);
  };

  return (
    <React.Fragment key={ticket.id}>
      <ListItem
        dense
        button
        onClick={(e) => {
          if (ticket.status === "pending") return;
          handleSelectTicket(ticket);
        }}
        selected={ticketId && +ticketId === ticket.id}
        className={clsx(classes.ticket, {
          [classes.pendingTicket]: ticket.status === "pending",
        })}
      >
        <Tooltip
          arrow
          placement="right"
          title={ticket.queue?.name || "Sem fila"}
        >
          <span
            style={{ backgroundColor: ticket.queue?.color || "#7C7C7C" }}
            className={classes.ticketQueueColor}
          ></span>
        </Tooltip>
        <ListItemAvatar>
          <Avatar src={ticket?.contact?.profilePicUrl} />
        </ListItemAvatar>
        <ListItemText
          disableTypography
          primary={
            <span className={classes.contactNameWrapper}>
              <Typography
                noWrap
                component="span"
                variant="body2"
                color="textPrimary"
              >
                {ticket.contact.name}
              </Typography>
              {ticket.status === "closed" && (
                <Badge
                  className={classes.closedBadge}
                  badgeContent={"closed"}
                  color="primary"
                />
              )}
{/*               {ticket.lastMessage && (
                <Typography
                  className={classes.lastMessageTime}
                  component="span"
                  variant="body2"
                  color="textSecondary"
                >
                  {isSameDay(parseISO(ticket.updatedAt), new Date()) ? (
                    <>{format(parseISO(ticket.updatedAt), "HH:mm")}</>
                  ) : (
                    <>{format(parseISO(ticket.updatedAt), "dd/MM/yyyy")}</>
                  )}
                </Typography>
              )} */}
            </span>
          }
/*           secondary={
            <span className={classes.contactNameWrapper}>
              <Typography
                className={classes.contactLastMessage}
                noWrap
                component="span"
                variant="body2"
                color="textSecondary"
              >
                {ticket.lastMessage ? (
                  <MarkdownWrapper>{ticket.lastMessage}</MarkdownWrapper>
                ) : (
                  <MarkdownWrapper></MarkdownWrapper>
                )}
              </Typography>

              <Badge
                className={classes.newMessagesCount}
                badgeContent={ticket.unreadMessages}
                classes={{
                  badge: classes.badgeStyle,
                }}
              />
            </span>
          } */
        />
        {ticket.status === "pending" && (
          <ButtonWithSpinner
            color="primary"
            variant="contained"
            className={classes.acceptButton}
            size="small"
            loading={loading}
            onClick={(e) => handleAcepptTicket(ticket)}
          >
            {i18n.t("ticketsList.buttons.accept")}
          </ButtonWithSpinner>
        )}
      </ListItem>
      <Divider variant="inset" component="li" />
    </React.Fragment>
  );
};

export default TicketListItem;
