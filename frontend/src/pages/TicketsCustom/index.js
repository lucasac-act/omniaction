import React, { useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputBase from "@material-ui/core/InputBase";

// Ícones do dashboard
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import ViewListIcon from "@material-ui/icons/ViewList";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import SearchIcon from "@material-ui/icons/Search";

import logo from "../../assets/logo.png";
import Ticket from "../../components/Ticket/";
import TicketsListCustom from "../../components/TicketsListCustom";
import { TagsFilter } from "../../components/TagsFilter";
import { UsersFilter } from "../../components/UsersFilter";
import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";
import NewTicketModal from "../../components/NewTicketModal";
import TicketsQueueSelect from "../../components/TicketsQueueSelect";
import { Can } from "../../components/Can";
import { makeStyles, useTheme } from "@material-ui/core/styles";

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
	mainContainer: {
		background: theme.palette.type === 'dark' 
			? 'rgba(255, 255, 255, 0.05)'
			: 'rgba(255, 255, 255, 0.8)',
		borderRadius: 20,
		boxShadow: theme.palette.type === 'dark' 
			? '0 8px 32px rgba(0, 0, 0, 0.4)'
			: '0 8px 32px rgba(0, 0, 0, 0.1)',
		overflow: 'hidden',
		backdropFilter: 'blur(10px)',
		border: theme.palette.type === 'dark' 
			? '1px solid rgba(255, 255, 255, 0.1)'
			: '1px solid rgba(255, 255, 255, 0.3)',
		minHeight: 700,
		display: 'flex',
		flexDirection: 'column',
	},
	ticketsSection: {
		padding: theme.spacing(3),
		background: theme.palette.type === 'dark' 
			? 'rgba(40,40,40,0.98)'
			: 'rgba(255,255,255,0.98)',
		borderRadius: '20px 20px 0 0',
		borderBottom: theme.palette.type === 'dark' 
			? '1px solid rgba(255, 255, 255, 0.1)'
			: '1px solid rgba(0, 0, 0, 0.1)',
	},
	ticketsSectionHeader: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: theme.spacing(3),
		paddingBottom: theme.spacing(2),
		borderBottom: theme.palette.type === 'dark' 
			? '2px solid rgba(255, 255, 255, 0.1)'
			: '2px solid rgba(0, 0, 0, 0.1)',
	},
	sectionTitle: {
		fontSize: '1.4rem',
		fontWeight: 600,
		color: theme.palette.type === 'dark' ? '#fff' : '#333',
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing(1),
	},
	sectionIcon: {
		color: theme.palette.primary.main,
	},
	detailsSection: {
		flex: 1,
		padding: theme.spacing(3),
		background: theme.palette.type === 'dark' 
			? 'rgba(30,30,30,0.97)'
			: 'rgba(255,255,255,0.97)',
		borderRadius: '0 0 20px 20px',
		minHeight: 500,
	},
	welcomeCard: {
		background: theme.palette.type === 'dark' 
			? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
			: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
		textAlign: "center",
		borderRadius: 16,
		boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
		border: theme.palette.type === 'dark' 
			? '1px solid rgba(255, 255, 255, 0.1)'
			: '1px solid rgba(255, 255, 255, 0.3)',
		minHeight: 400,
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
		fontSize: '1.3rem',
		fontWeight: 600,
		color: theme.palette.type === 'dark' ? '#e0e0e0' : '#333',
		marginBottom: theme.spacing(2),
		textAlign: 'center',
	},
	welcomeSubtext: {
		fontSize: '1rem',
		color: theme.palette.type === 'dark' ? '#b0b0b0' : '#666',
		textAlign: 'center',
		lineHeight: 1.6,
	},
	viewToggle: {
		display: 'flex',
		gap: theme.spacing(1),
	},
	viewToggleButton: {
		padding: theme.spacing(1),
		borderRadius: 8,
		border: 'none',
		background: 'transparent',
		cursor: 'pointer',
		transition: 'all 0.2s',
		color: theme.palette.type === 'dark' ? '#888' : '#666',
		'&:hover': {
			background: theme.palette.type === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
		},
		'&.active': {
			background: theme.palette.primary.main,
			color: '#fff',
		},
	},
	gridContainer: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
	},
	horizontalContainer: {
		display: 'flex',
		flex: 1,
		gap: theme.spacing(2),
		minHeight: 500,
	},
	ticketsListContainer: {
		flex: '0 0 400px', // largura fixa de 400px para a lista
		display: 'flex',
		flexDirection: 'column',
	},
	conversationContainer: {
		flex: 1, // ocupa o restante do espaço
		display: 'flex',
		flexDirection: 'column',
	},
	// Estilos personalizados para o TicketsManagerTabs horizontal
	customTicketsWrapper: {
		'& .MuiPaper-root': {
			background: 'transparent',
			boxShadow: 'none',
			borderRadius: 0,
		},
		'& .MuiTabs-root': {
			background: theme.palette.type === 'dark' 
				? 'rgba(255, 255, 255, 0.05)'
				: 'rgba(255, 255, 255, 0.9)',
			borderRadius: 12,
			margin: theme.spacing(1, 0),
			minHeight: 48,
		},
		'& .MuiTab-root': {
			minHeight: 48,
			textTransform: 'none',
			fontWeight: 500,
			fontSize: '0.9rem',
			color: theme.palette.type === 'dark' ? '#b0b0b0' : '#666',
			borderRadius: 12,
			margin: theme.spacing(0, 0.5),
			'&:hover': {
				background: theme.palette.type === 'dark' 
					? 'rgba(255, 255, 255, 0.1)'
					: 'rgba(0, 0, 0, 0.04)',
			},
			'&.Mui-selected': {
				background: theme.palette.primary.main,
				color: '#fff',
				fontWeight: 600,
			},
		},
		'& .MuiTabs-indicator': {
			display: 'none',
		},
		'& .MuiTabs-flexContainer': {
			gap: theme.spacing(0.5),
			padding: theme.spacing(0.5),
		},
		// Esconder a lista de tickets quando em modo horizontal
		'& .MuiTabPanel-root': {
			display: 'none',
		},
	},
	modernOptionsBar: {
		background: theme.palette.type === 'dark' 
			? 'rgba(255, 255, 255, 0.05)'
			: 'rgba(255, 255, 255, 0.8)',
		borderRadius: 12,
		padding: theme.spacing(1.5),
		margin: theme.spacing(1, 0),
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing(1),
		flexWrap: 'wrap',
		'& .MuiButton-root': {
			borderRadius: 8,
			textTransform: 'none',
			fontWeight: 600,
			fontSize: '0.85rem',
			padding: theme.spacing(1, 2),
			background: theme.palette.type === 'dark' ? '#333' : '#f5f5f5',
			color: theme.palette.type === 'dark' ? '#fff' : '#333',
			border: 'none',
			'&:hover': {
				background: theme.palette.primary.main,
				color: '#fff',
			},
		},
		'& .MuiFormControlLabel-root': {
			margin: 0,
			'& .MuiFormControlLabel-label': {
				fontSize: '0.85rem',
				color: theme.palette.type === 'dark' ? '#b0b0b0' : '#666',
				fontWeight: 500,
			},
		},
		'& .MuiSwitch-root': {
			'& .MuiSwitch-switchBase.Mui-checked': {
				color: theme.palette.primary.main,
			},
			'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
				backgroundColor: theme.palette.primary.main,
			},
		},
	},
	modernSearchBox: {
		background: theme.palette.type === 'dark' 
			? 'rgba(255, 255, 255, 0.08)'
			: 'rgba(255, 255, 255, 0.9)',
		borderRadius: 12,
		padding: theme.spacing(1),
		margin: theme.spacing(1, 0),
		display: 'flex',
		alignItems: 'center',
		border: theme.palette.type === 'dark' 
			? '1px solid rgba(255, 255, 255, 0.1)'
			: '1px solid rgba(0, 0, 0, 0.08)',
		'& .MuiSvgIcon-root': {
			color: theme.palette.primary.main,
			marginLeft: theme.spacing(1),
			marginRight: theme.spacing(1),
		},
		'& input': {
			flex: 1,
			border: 'none',
			background: 'transparent',
			padding: theme.spacing(1),
			fontSize: '0.9rem',
			color: theme.palette.type === 'dark' ? '#fff' : '#333',
			outline: 'none',
			'&::placeholder': {
				color: theme.palette.type === 'dark' ? '#888' : '#999',
			},
		},
	},
	modernSubTabs: {
		'& .MuiTabs-root': {
			background: theme.palette.type === 'dark' 
				? 'rgba(255, 255, 255, 0.03)'
				: 'rgba(255, 255, 255, 0.7)',
			borderRadius: 8,
			margin: theme.spacing(0.5, 0),
			minHeight: 42,
		},
		'& .MuiTab-root': {
			minHeight: 42,
			textTransform: 'none',
			fontWeight: 500,
			fontSize: '0.85rem',
			padding: theme.spacing(1, 2),
		},
		'& .MuiBadge-badge': {
			background: theme.palette.type === 'dark' 
				? 'linear-gradient(45deg, #ff6b6b, #ee5a24)'
				: 'linear-gradient(45deg, #667eea, #764ba2)',
			fontWeight: 600,
			fontSize: '0.7rem',
			minWidth: 18,
			height: 18,
		},
	},
}));

const TicketsCustom = () => {
	const classes = useStyles();
	const theme = useTheme();
	const { ticketId } = useParams();
	const { user } = useContext(AuthContext);
	const { profile } = user;
	const [tab, setTab] = useState("open");
	const [tabOpen, setTabOpen] = useState("open");
	const [openCount, setOpenCount] = useState(0);
	const [pendingCount, setPendingCount] = useState(0);
	const [newTicketModalOpen, setNewTicketModalOpen] = useState(false);
	const [showAllTickets, setShowAllTickets] = useState(false);
	const [searchParam, setSearchParam] = useState("");
	const [selectedTags, setSelectedTags] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [selectedQueueIds, setSelectedQueueIds] = useState(user.queues.map((q) => q.id) || []);
	const [viewMode, setViewMode] = useState("list"); // list ou grid
	const searchInputRef = useRef();

	const handleOpenNewTicket = () => setNewTicketModalOpen(true);
	const handleChangeTab = (e, newValue) => setTab(newValue);
	const handleChangeTabOpen = (e, newValue) => setTabOpen(newValue);
	const handleSearch = (e) => setSearchParam(e.target.value.toLowerCase());
	const handleSelectedTags = (newTags) => setSelectedTags(newTags);
	const handleSelectedUsers = (newUsers) => setSelectedUsers(newUsers);

	const applyPanelStyle = (status) => {
		if (tabOpen !== status) {
			return { width: 0, height: 0 };
		}
	};

	return (
		<div className={classes.root}>
			<Container maxWidth="xl" disableGutters>
				{/* Container Principal */}
				<Paper className={classes.mainContainer}>
					<div className={classes.gridContainer}>
						{/* Seção de Menu de Tickets - No Topo */}
						<div className={classes.ticketsSection}>
							<div className={classes.ticketsSectionHeader}>
								<Typography className={classes.sectionTitle}>
									<ViewListIcon className={classes.sectionIcon} />
									{i18n.t("mainDrawer.listItems.tickets") || "Atendimentos"}
								</Typography>
								<div className={classes.viewToggle}>
									<button 
										className={`${classes.viewToggleButton} ${viewMode === 'list' ? 'active' : ''}`}
										onClick={() => setViewMode('list')}
									>
										<ViewListIcon />
									</button>
									<button 
										className={`${classes.viewToggleButton} ${viewMode === 'grid' ? 'active' : ''}`}
										onClick={() => setViewMode('grid')}
									>
										<ViewModuleIcon />
									</button>
								</div>
							</div>
							
							{/* Menu de Tickets Horizontal Personalizado */}
							<div className={classes.customTicketsWrapper}>
								{/* Abas Principais e Controles na mesma linha */}
								<Paper elevation={0} className={classes.modernOptionsBar}>
									<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
										{/* Abas à esquerda */}
										<Tabs
											value={tab}
											onChange={handleChangeTab}
											indicatorColor="primary"
											textColor="primary"
											style={{flex: '0 0 auto'}}
										>
											<Tab
												value={"open"}
												icon={<MoveToInboxIcon />}
												label={
													<Badge badgeContent={openCount + pendingCount} color="primary">
														{i18n.t("tickets.tabs.open.title")}
													</Badge>
												}
											/>
											<Tab
												value={"closed"}
												icon={<CheckBoxIcon />}
												label={i18n.t("tickets.tabs.closed.title")}
											/>
											<Tab
												value={"search"}
												icon={<SearchIcon />}
												label={i18n.t("tickets.tabs.search.title")}
											/>
										</Tabs>

										{/* Separador vertical */}
										<div style={{
											height: '40px',
											width: '1px',
											backgroundColor: theme.palette.type === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
											margin: '0 16px'
										}} />

										{/* Controles à direita */}
										<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
											<Button
												variant="contained"
												color="primary"
												onClick={handleOpenNewTicket}
												size="small"
											>
												{i18n.t("ticketsManager.buttons.newTicket")}
											</Button>
											<Can
												role={user.profile}
												perform="tickets-manager:showall"
												yes={() => (
													<FormControlLabel
														label={i18n.t("tickets.buttons.showAll")}
														labelPlacement="start"
														control={
															<Switch
																size="small"
																checked={showAllTickets}
																onChange={() => setShowAllTickets((prevState) => !prevState)}
																name="showAllTickets"
																color="primary"
															/>
														}
													/>
												)}
											/>
											<TicketsQueueSelect
												selectedQueueIds={selectedQueueIds}
												userQueues={user?.queues}
												onChange={(values) => setSelectedQueueIds(values)}
											/>
										</div>
									</div>
								</Paper>

								{/* Barra de Busca (apenas quando a aba search estiver ativa) */}
								{tab === "search" && (
									<Paper elevation={0} className={classes.modernSearchBox}>
										<div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
											<SearchIcon />
											<InputBase
												inputRef={searchInputRef}
												placeholder={i18n.t("tickets.search.placeholder")}
												type="search"
												onChange={handleSearch}
												style={{flex: 1, marginLeft: 8}}
											/>
										</div>
									</Paper>
								)}

								{/* Sub-abas para tickets abertos */}
								{tab === "open" && (
									<div className={classes.modernSubTabs}>
										<Tabs
											value={tabOpen}
											onChange={handleChangeTabOpen}
											indicatorColor="primary"
											textColor="primary"
											variant="fullWidth"
										>
											<Tab
												label={
													<Badge
														badgeContent={openCount}
														color="primary"
													>
														{i18n.t("ticketsList.assignedHeader")}
													</Badge>
												}
												value={"open"}
											/>
											<Tab
												label={
													<Badge
														badgeContent={pendingCount}
														color="secondary"
													>
														{i18n.t("ticketsList.pendingHeader")}
													</Badge>
												}
												value={"pending"}
											/>
										</Tabs>
									</div>
								)}

								{/* Filtros para busca */}
								{tab === "search" && (
									<div style={{marginTop: 8}}>
										<TagsFilter onFiltered={handleSelectedTags} />
										{profile === "admin" && (
											<UsersFilter onFiltered={handleSelectedUsers} />
										)}
									</div>
								)}
							</div>
						</div>

						{/* Container Horizontal - Lista na Esquerda, Conversa na Direita */}
						<div className={classes.horizontalContainer}>
							{/* Lista de Tickets - Esquerda */}
							<div className={classes.ticketsListContainer}>

								
								<div style={{flex: 1, minHeight: 400}}>
									{/* Aba de Tickets Abertos */}
									{tab === "open" && (
										<div style={{display: 'flex', height: '100%'}}>
											<TicketsListCustom
												status="open"
												showAll={showAllTickets}
												selectedQueueIds={selectedQueueIds}
												updateCount={(val) => setOpenCount(val)}
												style={applyPanelStyle("open")}
											/>
											<TicketsListCustom
												status="pending"
												selectedQueueIds={selectedQueueIds}
												updateCount={(val) => setPendingCount(val)}
												style={applyPanelStyle("pending")}
											/>
										</div>
									)}

									{/* Aba de Tickets Fechados */}
									{tab === "closed" && (
										<TicketsListCustom
											status="closed"
											showAll={true}
											selectedQueueIds={selectedQueueIds}
										/>
									)}

									{/* Aba de Busca */}
									{tab === "search" && (
										<TicketsListCustom
											searchParam={searchParam}
											showAll={true}
											tags={selectedTags}
											users={selectedUsers}
											selectedQueueIds={selectedQueueIds}
										/>
									)}
								</div>
							</div>

							{/* Seção de Conversa - Direita */}
							<div className={classes.conversationContainer}>
								<div className={classes.detailsSection} style={{borderRadius: '16px', padding: '24px'}}>
									{ticketId ? (
										<>
											<div className={classes.ticketsSectionHeader}>
												<Typography className={classes.sectionTitle}>
													<TrendingUpIcon className={classes.sectionIcon} />
													Conversa Ativa
												</Typography>
												<Badge badgeContent="ONLINE" color="primary">
													<Avatar style={{width: 32, height: 32, fontSize: '0.9rem'}}>
														{user?.name?.charAt(0)}
													</Avatar>
												</Badge>
											</div>
											<Ticket />
										</>
									) : (
										<Paper elevation={0} className={classes.welcomeCard}>
											<div className={classes.welcomeContent}>
												<img 
													className={classes.welcomeLogo} 
													src={logo} 
													alt="Sistema de Atendimentos" 
												/>
												<div className={classes.welcomeText}>
													{i18n.t("chat.welcomeMessage") || "Bem-vindo ao Sistema de Tickets"}
												</div>
												<div className={classes.welcomeSubtext}>
													{i18n.t("chat.selectTicketMessage") || "Selecione um ticket da lista à esquerda para começar a conversar"}
												</div>
											</div>
										</Paper>
									)}
								</div>
							</div>
						</div>
					</div>
				</Paper>

				{/* Modal de Novo Ticket */}
				<NewTicketModal
					modalOpen={newTicketModalOpen}
					onClose={() => setNewTicketModalOpen(false)}
				/>
			</Container>
		</div>
	);
};

export default TicketsCustom;
