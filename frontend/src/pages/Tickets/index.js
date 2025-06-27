import React from "react";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import TicketsManager from "../../components/TicketsManager/";
import Ticket from "../../components/Ticket/";

import logo from "../../assets/logo.png";

import { i18n } from "../../translate/i18n";

const useStyles = makeStyles(theme => ({
	root: {
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(4),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		background: theme.palette.type === 'dark' 
			? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
			: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
		minHeight: '100vh',
	},
	card: {
		borderRadius: 16,
		boxShadow: theme.palette.type === 'dark' 
			? '0 8px 32px rgba(0, 0, 0, 0.4)'
			: '0 8px 32px rgba(0, 0, 0, 0.1)',
		overflow: 'hidden',
		position: 'relative',
		backdropFilter: 'blur(10px)',
		border: theme.palette.type === 'dark' 
			? '1px solid rgba(255, 255, 255, 0.1)'
			: '1px solid rgba(255, 255, 255, 0.3)',
		minHeight: 600,
		display: 'flex',
		flexDirection: 'column',
	},
	ticketsArea: {
		display: 'flex',
		height: '100%',
		minHeight: 600,
	},
	contactsWrapper: {
		display: "flex",
		height: "100%",
		flexDirection: "column",
		overflowY: "hidden",
		borderTopLeftRadius: 16,
		borderBottomLeftRadius: 16,
		background: theme.palette.type === 'dark' 
			? 'rgba(255, 255, 255, 0.05)'
			: 'rgba(255, 255, 255, 0.8)',
		backdropFilter: 'blur(10px)',
	},
	messagessWrapper: {
		display: "flex",
		height: "100%",
		flexDirection: "column",
		borderTopRightRadius: 16,
		borderBottomRightRadius: 16,
		background: theme.palette.type === 'dark' 
			? 'rgba(255, 255, 255, 0.03)'
			: 'rgba(255, 255, 255, 0.9)',
		backdropFilter: 'blur(10px)',
	},
	welcomeMsg: {
		background: theme.palette.type === 'dark' 
			? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
			: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
		textAlign: "center",
		borderTopRightRadius: 16,
		borderBottomRightRadius: 16,
		backdropFilter: 'blur(10px)',
		border: theme.palette.type === 'dark' 
			? '1px solid rgba(255, 255, 255, 0.1)'
			: '1px solid rgba(255, 255, 255, 0.3)',
	},
	welcomeContent: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		padding: theme.spacing(4),
		maxWidth: 400,
	},
	welcomeLogo: {
		width: "60%",
		maxWidth: 200,
		height: "auto",
		marginBottom: theme.spacing(3),
		filter: theme.palette.type === 'dark' ? 'brightness(0.9) contrast(1.1)' : 'none',
		transition: 'transform 0.3s ease-in-out',
		'&:hover': {
			transform: 'scale(1.05)',
		},
	},
	welcomeText: {
		fontSize: '1.2rem',
		fontWeight: 500,
		color: theme.palette.type === 'dark' ? '#b0b0b0' : '#666',
		marginBottom: theme.spacing(2),
		textAlign: 'center',
	},
	welcomeSubtext: {
		fontSize: '0.9rem',
		color: theme.palette.type === 'dark' ? '#888' : '#999',
		textAlign: 'center',
		lineHeight: 1.6,
	},
}));

const Chat = () => {
	const classes = useStyles();
	const { ticketId } = useParams();

	return (
		<div className={classes.root}>
			<Container maxWidth="lg" disableGutters>
				<Paper className={classes.card} elevation={3}>
					<div className={classes.ticketsArea}>
						<Grid container spacing={0} style={{height: '100%'}}>
							<Grid item xs={12} md={4} className={classes.contactsWrapper}>
								<TicketsManager />
							</Grid>
							<Grid item xs={12} md={8} className={classes.messagessWrapper}>
								{ticketId ? (
									<Ticket />
								) : (
									<Paper square variant="outlined" className={classes.welcomeMsg}>
										<div className={classes.welcomeContent}>
											<img 
												className={classes.welcomeLogo} 
												src={logo} 
												alt="logologin" 
											/>
											<div className={classes.welcomeText}>
												{i18n.t("chat.welcomeMessage") || "Bem-vindo ao Sistema de Tickets"}
											</div>
											<div className={classes.welcomeSubtext}>
												{i18n.t("chat.selectTicketMessage") || "Selecione um ticket da lista ao lado para começar a conversar"}
											</div>
										</div>
									</Paper>
								)}
							</Grid>
						</Grid>
					</div>
				</Paper>
			</Container>
		</div>
	);
};

export default Chat;
