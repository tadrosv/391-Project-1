import React, { useState } from 'react';
import { IonButton, IonContent, IonGrid, IonIcon, IonLabel, IonList, IonPage, IonRow, IonToolbar, useIonAlert } from '@ionic/react';
import { gridOutline, imageOutline, peopleOutline, basketballOutline, homeOutline, closeOutline, chevronForward, menuOutline, powerOutline } from 'ionicons/icons';
import ReactDOM from 'react-dom';
import { useHistory } from "react-router-dom";
import './Dashboard.css';

const Dashboard = () => {
	
	const [presentAlert] = useIonAlert();			// Triggers logout ion alert
	const [layoutItems, setLayout] = useState([]);  // layout item holder
	const [sidebar, setSidebar] = useState(false);	// Sets nav side bar state to false (closed)
	const showSidebar = () => setSidebar(!sidebar); // Triggering sidebar to expand
	const history = useHistory();

	function onSelectMenu (elementId){
		document.getElementById(elementId)?.setAttribute("id", "menu-items1");
	}

	/**
	 * Retrieves current viewport's width
	 * @returns the viewport's width
	 */
	function getWindowDimensions() {
		const {innerWidth: width} = window;
		return width
	}

	function routeChange() { 
		let path = '/controller'; 
		history.push(path);
		window.location.reload();
	  }

	/** 
	 * Gets the list of items from API response and stores the data into layout item holder 
	 * for displaying in current viewport
	 */ 
	/* useEffect(()=>{
		
		axios.get('http://192.168.1.173:9091/api/v1/layouts')
		  .then(res=>{
			//console.log(res.data);
			setLayout(res.data);
			//console.log(layoutItems);
		  })
		  .catch(err=>{
			console.log(err);
		  })
	 }, []) */


	/**
	 * Send error of parameter 'message' to the 'errorMessage' in 
	 * ReactDOM.render().
	 * @param message a string error message to be displayed 
	 */
	function sendError(message = '') {
		ReactDOM.render((<p id="errorMessage">{message}</p>), document.getElementById('errorMessage'));
	}

	return (
		<IonPage id='dashboard-page'>
			
			<IonContent fullscreen>
			
				<IonToolbar  id='dashboard-toolBar'>
					<IonRow id='row-container'>
						
						<IonButton fill='clear' color="medium" id='menu-button' shape='round' size='small' onClick={showSidebar}>
							<IonIcon slot='icon-only' icon={menuOutline}></IonIcon>
						</IonButton>

						<a href='dashboard'> <img id="scorevu-img" src={process.env.PUBLIC_URL + '/macewan.PNG'} alt="macewan"></img>	</a>

						<h1 id='page-header-title' >Dashboard</h1>

						<IonButton /* key={topButtons?.length ?? 0} */ data-tip data-for="logout-tooltip" size='small' id='logout' fill='clear'
							onClick={() => presentAlert({
								cssClass: 'secondary',
								header: 'Log out',
								subHeader: 'Are you sure you want to log out?',
								buttons: [{
									text: 'No',
									role: 'cancel',
									id: 'cancel-button',
								},
								{
									text: 'Yes',
									id: 'confirm-button',
									handler: () => window.location.replace('/login')
								}],
								})}>
							<IonIcon slot='icon-only' icon={powerOutline} size='small'></IonIcon>
						</IonButton>
						
					</IonRow>

				</IonToolbar>

				<div id='dashboard-fullpage'>
					
					<aside aria-label='Project navigation' className={sidebar ? 'nav-sidebar active' : 'nav-sidebar'}>
							
						<IonContent className='sidebar-content'>

							<IonList id='menu-list' color= "dark">
								
								<IonButton className='menu-items' onClick={() => { }}>
									<IonIcon className={getWindowDimensions() < 768 ? 'menu-icons-mobile': 'menu-icons'} icon={homeOutline} size='small'></IonIcon>	
									<IonLabel className={sidebar ? 'menu-labels' : 'menu-labels collapsed' }>Dashboard</IonLabel>
								</IonButton>

								<IonButton className='menu-items' onClick={() => { }}>
									<IonIcon className={getWindowDimensions() < 768 ? 'menu-icons-mobile': 'menu-icons'} icon={peopleOutline} size='small'></IonIcon>	
									<IonLabel className={sidebar ? 'menu-labels' : 'menu-labels collapsed' }>Users</IonLabel>
								</IonButton>

								<IonButton className='menu-items' onClick={() => { }}>
									<IonIcon className={getWindowDimensions() < 768 ? 'menu-icons-mobile': 'menu-icons'} icon={gridOutline} size='small'></IonIcon>	
									<IonLabel className={sidebar ? 'menu-labels' : 'menu-labels collapsed' }>Courses</IonLabel>
								</IonButton>

								<IonButton className='menu-items' onClick={() => { }}>
									<IonIcon className={getWindowDimensions() < 768 ? 'menu-icons-mobile': 'menu-icons'} icon={imageOutline} size='small'></IonIcon>	
									<IonLabel className={sidebar ? 'menu-labels' : 'menu-labels collapsed' }>Lorem</IonLabel>
								</IonButton>

								<IonButton className='menu-items' onClick={() => { }}>
									<IonIcon className={getWindowDimensions() < 768 ? 'menu-icons-mobile': 'menu-icons'} icon={basketballOutline} size='small'></IonIcon>	
									<IonLabel className={sidebar ? 'menu-labels' : 'menu-labels collapsed' }>Lorem</IonLabel>
								</IonButton>

							</IonList>

							<IonButton className={sidebar ? 'expand-sidebar-button active' : 'expand-sidebar-button'}  onClick={showSidebar}>
								<IonIcon className={sidebar ? 'expand-icon backward' : 'expand-icon'} icon={chevronForward} size='small'></IonIcon>
								<IonIcon id='close-icon' icon={closeOutline} size='small'></IonIcon>	
								<IonLabel id='collapse-label' className={sidebar ? 'collapse-label' : 'collapse-label collapsed'}>Collapse menu</IonLabel>
								<IonLabel id='close-label'>Close menu</IonLabel>
							</IonButton>

						</IonContent>
					</aside>
					
						<IonGrid id='item-grid'>
							
						</IonGrid>
								
				</div>

			</IonContent>
			
		</IonPage>
	);

}

export default Dashboard; 