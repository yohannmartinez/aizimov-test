import React from 'react';
import { Field, reduxForm } from 'redux-form';
import validate from './validate';
import renderField from './renderField';
import 'react-widgets/dist/css/react-widgets.css';
import { Multiselect } from 'react-widgets';
import {scrollToFirstError} from './scrollToFirstError'



 const renderMultiselect = ({ input, data, valueField, textField, defaultdata }) =>
  <Multiselect {...input} 
    onBlur={() => input.onBlur()}
    value={input.value || defaultdata} // requires value to be an array
    data={data}
    className = 'chosen-container-multi'
    valueField={valueField}
    textField={textField}
    selectedValue={data}
  />  



const WizardFormSecondPage = props => {

  const divise_en_trois = "col-lg-4 col-md-6 col-sm-12 col-xs-12"

  const { handleSubmit, previousPage } = props;
  return (
    <form onSubmit={handleSubmit}>
        <div className = 'form-page-title'> 2. Informations sur l'entrepôt </div> 
        <div className = "form-row-input"> 
          <div className = "form-element form-element-seul" >
          <Field
              name="tailleenm2"
              type="text"
              component={renderField}
              placeholder = "5000 m2"
              label="Taille de l'entrepot*"
            />
          </div>
        <p className = "form-explication-text">
            La taille de votre entrepôt en m2. 
        </p>  
        </div>  

        <div className = "form-row-input"> 
          <div className = "form-element form-element-seul" >
          <Field
              name="palettesdispo"
              type="text"
              component={renderField}
              placeholder = "2000"
              label="Surface palette disponible*"
            />
          </div>
          <div className = "form-space"></div>
        <p className = "form-explication-text">
            Le nombre d'emplacement palettes de votre entrepôt. 
        </p>  
        </div>   

        <div className = "form-row-input"> 
          <div className = "form-element form-element-divise-en-2-petit" >
            <label className = 'form-label'>Racké</label>
            <div>
              <Field name="rackebool" component="select" className = "form-select-input input-select">
                <option value={true}>Oui</option>
                <option value={false}>Non</option>                
              </Field>   
            </div> 
          </div>      
          <div className = "form-space"></div>             
          <div className = "form-element form-element-divise-en-2-gros" >
          <Field
              name="tailleraks"
              type="text"
              component={renderField}
              placeholder = "6.5m"
              label="Hauteur maximale des racks"
            />
          </div>          
          <p className = "form-explication-text">
              Si votre entrepôt est racké, veuillez préciser la hauteur maximale des racks
          </p>  
        </div>                 

        <div className = "form-row-input"> 
          <div className = "form-element form-element-divise-en-2-petit" >
            <label className = 'form-label'>Stockage ambiant couvert</label>
            <div>
              <Field name="secbool" component="select" className = "form-select-input input-select">
                <option value={false}>Non</option>                
                <option value={true}>Oui</option>                
              </Field>   
            </div> 
          </div>      
          <div className = "form-space"></div>             
          <div className = "form-element form-element-divise-en-2-gros" >
          <Field
              name="secm2"
              type="text"
              component={renderField}
              placeholder = "4,000m2"
              label="Si oui, combien de m2 en ambiant couvert?"
            />
          </div>          
          <p className = "form-explication-text">
              Si vous stockez en ambiant couvert, veuillez préciser le nombre de m2 concernés 
          </p>  
        </div>

        <div className = "form-row-input"> 
          <div className = "form-element form-element-divise-en-2-petit" >
            <label className = 'form-label'>Stockage frais</label>
            <div>
              <Field name="fraisbool" component="select" className = "form-select-input input-select">
                <option value={false}>Non</option>                
                <option value={true}>Oui</option>                
              </Field>   
            </div> 
          </div>      
          <div className = "form-space"></div>             
          <div className = "form-element form-element-divise-en-2-gros" >
          <Field
              name="fraism2"
              type="text"
              component={renderField}
              placeholder = "2,000m2"
              label="Si oui, combien de m2 en frais?"
            />
          </div>          
          <p className = "form-explication-text">
              Si vous pouvez stocker du frais, veuillez préciser le nombre de m2 concernés 
          </p>  
        </div>
        <div className = "form-row-input"> 
          <div className = "form-element form-element-divise-en-2-petit" >
            <label className = 'form-label'>Stockage surgelé</label>
            <div>
              <Field name="surgelebool" component="select" className = "form-select-input input-select">
                <option value={false}>Non</option>                
                <option value={true}>Oui</option>                
              </Field>   
            </div> 
          </div>      
          <div className = "form-space"></div>             
          <div className = "form-element form-element-divise-en-2-gros" >
          <Field
              name="surgelem2"
              type="text"
              component={renderField}
              placeholder = "1,000m2"
              label="Si oui, combien de m2 en surgelé?"
            />
          </div>          
          <p className = "form-explication-text">
              Si vous pouvez stocker du surgelé, veuillez préciser le nombre de m2 concernés 
          </p>  
        </div>        


        <div className = "form-row-input"> 
          <div className = "form-element form-element-divise-en-2-petit" >
            <label className = 'form-label'>Stockage extérieur</label>
            <div>
              <Field name="vracbool" component="select" className = "form-select-input input-select">
                <option value={false}>Non</option>
                <option value={true}>Oui</option>
              </Field>   
            </div> 
          </div>      
          <div className = "form-space"></div>             
          <div className = "form-element form-element-divise-en-2-gros" >
          <Field
              name="produitsvrac"
              type="text"
              component={renderField}
              placeholder = "Sucre, bidons, etc"
              label="Si oui, combien de m2 en extérieur"
            />
          </div>          
          <p className = "form-explication-text">
              Si vous stockez en extérieur, veuillez préciser le nombre de m2 concernés
          </p>  
        </div>  

        <div className = "form-row-input"> 
          <div className = "form-element form-element-seul" >
          <Field
              name="quaisdechargement"
              type="text"
              component={renderField}
              placeholder = "2"
              label="Nombre de quais de chargement"
            />
          </div>
        <p className = "form-explication-text">
            Le nombre de quais de chargement, si vous en avez. 
        </p>  
        </div>         


        <div className = "form-row-input"> 
          <div className = "form-element form-element-seul" >

              <label className = "form-label">Jours d'ouverture</label>
              <Field
                name="joursdouverture"
                component={renderMultiselect}
                className = 'form-multiselect'
                data={[ 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche' ]}
                defaultdata= {[ 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']}
              />
          </div>
            <p className = "form-explication-text">
                Rajouter ou retirer des jours selon votre convenance.
            </p>               
        </div>
    

        <div className = "form-row-input"> 
          <div className = "form-element form-element-divise-en-2" >
          <Field
              name="heureouverture"
              type="text"
              component={renderField}
              label="Horaire d'ouverture"
              placeholder= "8h"
            />
          </div>
          <div className = "form-space"> </div>
          <div className = "form-element form-element-divise-en-2" >
            <Field
              name="heurefermeture"
              type="text"
              component={renderField}
              label="Horaire de fermeture"
              placeholder = "17h"
            />
          </div>
        <p className = "form-explication-text">
          Heures d'ouverture de l'entrepôt pendant lesquelles les entrées/sorties de stocks sont possibles.  
        </p> 
      </div>

        <div className = "form-row-input"> 
          <div className = "form-element form-element-seul" >
              <label  className = "form-label" style = {{paddingBottom: '1rem'}} >Classe d'entrepôt</label>
                <div className = "row"> 
                  <div className ="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                    <Field
                      name="classeA" type="checkbox" component={renderField} sameline= {true}
                      label="Classe A" classVariableBox = "checkbox-classes-box"
                      classVariableText = "checkbox-classes-text"
                      classVariableBoxChecked = "checkbox-classes-box-checked"
                    />
                  </div>
                  <div className ="col-lg-6 col-md-12 col-sm-12 col-xs-12" >
                    <Field 
                      name="classeB" type="checkbox" component={renderField} sameline= {true}
                      label="Classe B" classVariableBox = "checkbox-classes-box"
                      classVariableText = "checkbox-classes-text"
                      classVariableBoxChecked = "checkbox-classes-box-checked"
                    />
                  </div>
                  <div className ="col-lg-6 col-md-12 col-sm-12 col-xs-12">                
                    <Field
                      name="classeC" type="checkbox" component={renderField} sameline= {true}
                      label="Classe C" classVariableBox = "checkbox-classes-box"
                      classVariableText = "checkbox-classes-text"
                      classVariableBoxChecked = "checkbox-classes-box-checked"
                    />   
                  </div>
                                                                                       
                </div>
              </div>
          <p className = "form-explication-text">
            Classe(s) de votre entrepôt
          </p> 
        </div>


        <div className = "form-row-input"> 
          <div className = "form-element form-element-seul" >
              <label className = "form-label" style = {{paddingBottom: '1rem'}} >Certifications</label>
                <div className = "row"> 
                  <div className = {divise_en_trois}>
                    <Field
                      name="certif1510" type="checkbox" component={renderField} sameline= {true}
                      label="1510"  classVariableBox = "checkbox-classes-box"
                      classVariableText = "checkbox-certifs-text"
                      classVariableBoxChecked = "checkbox-classes-box-checked"
                    />
                  </div>
                  <div className = {divise_en_trois}>
                    <Field
                      name="certif1511" type="checkbox" component={renderField} sameline= {true}
                      label="1511" classVariableBox = "checkbox-classes-box"
                      classVariableText =  "checkbox-certifs-text"
                      classVariableBoxChecked = "checkbox-classes-box-checked"
                    />
                  </div>
                  <div className = {divise_en_trois}>                
                    <Field
                      name="certif1530" type="checkbox" component={renderField} sameline= {true}
                      label="1530" classVariableBox = "checkbox-classes-box"
                      classVariableText = "checkbox-certifs-text"
                      classVariableBoxChecked = "checkbox-classes-box-checked"
                    />   
                  </div>
                  <div className = {divise_en_trois}>                
                    <Field
                      name="certif1532" type="checkbox" component={renderField} sameline= {true}
                      label="1532" classVariableBox = "checkbox-classes-box"
                      classVariableText = "checkbox-certifs-text"
                      classVariableBoxChecked = "checkbox-classes-box-checked"
                    />   
                  </div>

                  <div className = {divise_en_trois}>                
                    <Field
                      name="certif2160" type="checkbox" component={renderField} sameline= {true}
                      label="2160" classVariableBox = "checkbox-classes-box"
                      classVariableText = "checkbox-certifs-text"
                      classVariableBoxChecked = "checkbox-classes-box-checked"                      
                    />   
                  </div>
                  <div className = {divise_en_trois}>                
                    <Field
                      name="certif2662" type="checkbox" component={renderField} sameline= {true}
                      label="2662" classVariableBox = "checkbox-classes-box"
                      classVariableText = "checkbox-certifs-text"
                      classVariableBoxChecked = "checkbox-classes-box-checked"                      
                    />   
                  </div>

                  <div className = {divise_en_trois}>                
                    <Field
                      name="certif2663" type="checkbox" component={renderField} sameline= {true}
                      label="2663" classVariableBox = "checkbox-classes-box"
                      classVariableText = "checkbox-certifs-text"
                      classVariableBoxChecked = "checkbox-classes-box-checked"                    
                    />   
                  </div>                                                                                       
                </div>
                <Field
                    name="autres_certifs"
                    type="text"
                    component={renderField}
                    placeholder = "Autres.."
                    label="Autres certifications"
                />                    
              </div>
          <p className = "form-explication-text">
            Veuillez cocher les certifications de votre entrepôt
          </p> 
        </div>


        <div className = "form-row-input"> 
          <div className = "form-element form-element-seul" >
              <label className = "form-label" style = {{paddingBottom: '1rem'}} >Entrepôt sous douane</label>
                <div className = "row">               
                  <div className = {divise_en_trois}>                
                    <Field
                      name="sousdouanebool" type="checkbox" component={renderField} sameline= {true}
                      label="Oui"  classVariableBox = "checkbox-classes-box"
                      classVariableText = "checkbox-certifs-text"
                      classVariableBoxChecked = "checkbox-classes-box-checked"
                    />
                  </div>
                  <div className = {divise_en_trois}>                
                  </div>
                  <div className = {divise_en_trois}>                
                  </div>                                     
                </div>
          </div>
          <p className = "form-explication-text">
            Votre entrepôt est-il sous douane? 
          </p> 
        </div>





        <div className = "form-row-input"> 
          <div className = "form-element form-element-seul" >
              <label className = "form-label" style = {{paddingBottom: '1rem'}} >Produits stockés</label>
                <div className = "row"> 
                  <div className ="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <Field
                      name="produit1" type="checkbox" component={renderField} sameline= {true}
                      label="Produits à base de bois, carton ou papier" 
                      classVariableBox = "checkbox-produits-box"
                      classVariableText = "checkbox-produits-text" 
                      classVariableBoxChecked = "checkbox-classes-box-checked"                                            
                    />
                  </div>
                  <div className ="col-lg-12 col-md-12 col-sm-12 col-xs-12" >
                    <Field
                      name="produit2" type="checkbox" component={renderField} sameline= {true}
                      label="Produits à base de plastique" 
                      classVariableBox = "checkbox-produits-box"
                      classVariableText = "checkbox-produits-text" 
                      classVariableBoxChecked = "checkbox-classes-box-checked"                       
                    />
                  </div>
                  <div className ="col-lg-12 col-md-12 col-sm-12 col-xs-12">                
                    <Field
                      name="produit3" type="checkbox" component={renderField} sameline= {true}
                      label="Produits électroniques ou électriques" 
                      classVariableBox = "checkbox-produits-box"
                      classVariableText = "checkbox-produits-text" 
                      classVariableBoxChecked = "checkbox-classes-box-checked"                         
                    />   
                  </div>
                  <div className ="col-lg-12 col-md-12 col-sm-12 col-xs-12">                
                    <Field
                      name="produit4" type="checkbox" component={renderField} sameline= {true}
                      label="Produits de consommation périssables" 
                      classVariableBox = "checkbox-produits-box"
                      classVariableText = "checkbox-produits-text" 
                      classVariableBoxChecked = "checkbox-classes-box-checked"                      
                    />   
                  </div>

                  <div className ="col-lg-12 col-md-12 col-sm-12 col-xs-12">                
                    <Field
                      name="produit5" type="checkbox" component={renderField} sameline= {true}
                      label="Matériaux de construction ou outillage"
                      classVariableBox = "checkbox-produits-box"
                      classVariableText = "checkbox-produits-text" 
                      classVariableBoxChecked = "checkbox-classes-box-checked"                                            
                    />   
                  </div>
                  <div className ="col-lg-12 col-md-12 col-sm-12 col-xs-12">                
                    <Field
                      name="produit6" type="checkbox" component={renderField} sameline= {true}
                      label="Produits textiles"
                      classVariableBox = "checkbox-produits-box"
                      classVariableText = "checkbox-produits-text" 
                      classVariableBoxChecked = "checkbox-classes-box-checked"                        
                    />   
                  </div>

                  <div className ="col-lg-12 col-md-12 col-sm-12 col-xs-12">                
                    <Field
                      name="produit7" type="checkbox" component={renderField} sameline= {true}
                      label="Produits dangereux"
                      classVariableBox = "checkbox-produits-box"
                      classVariableText = "checkbox-produits-text" 
                      classVariableBoxChecked = "checkbox-classes-box-checked"                     
                    />   
                  </div>
                  <div className ="col-lg-12 col-md-12 col-sm-12 col-xs-12">                
                    <Field
                      name="produit8" type="checkbox" component={renderField} sameline= {true}
                      label="Produits de consommation non périssables"
                      classVariableBox = "checkbox-produits-box"
                      classVariableText = "checkbox-produits-text" 
                      classVariableBoxChecked = "checkbox-classes-box-checked"                        
                    />   
                  </div>                                                                                          
                </div>
              </div>
          <p className = "form-explication-text">
            Veuillez cocher les produits que vous stockez
          </p> 
        </div>

        <div className = "form-row-input"> 
          <div className = "form-element form-element-divise-en-2-petit" >
            <label className = 'form-label'>WMS/ERP*</label>
            <div>
              <Field name="wmserpbool" component="select" className = "form-select-input input-select">
                <option value={true}>Oui</option>
                <option value={false}>Non</option>                
              </Field>   
            </div> 
          </div>      
          <div className = "form-space"></div>             
          <div className = "form-element form-element-divise-en-2-gros" >
          <Field
              name="wmserpdetail"
              type="text"
              component={renderField}
              placeholder = "Reflex WMS, SAP"
              label="Détails du WMS/ERP"
            />
          </div>          
          <p className = "form-explication-text">
              Si vous utilisez un système informatique pour la gestion de stocks, merci de le préciser
          </p>  
        </div>  


        <div className = "form-row-input"> 
          <div className = "form-element form-element-divise-en-2" >
            <Field
                name="périodeplusremplie"
                type="text"
                component={renderField}
                placeholder = "Juillet-Septembre"
                label="Période la plus remplie"
              />
          </div>
          <div className = "form-space"></div>
          <div className = "form-element form-element-divise-en-2" >
            <div>
             <Field
                name="tauxremplissageperiodehaute"
                type="text"
                component={renderField}
                placeholder = "85%"
                label="Taux de remplissage (en %)"
              />
            </div> 
          </div>          
        <p className = "form-explication-text">
            Période de l'année pendant laquelle l'entrepôt est le plus rempli
        </p>  
        </div>         

        <div className = "form-row-input"> 
          <div className = "form-element form-element-divise-en-2" >
            <Field
                name="périodemoinsremplie"
                type="text"
                component={renderField}
                placeholder = "Février-Avril"
                label="Période la moins remplie"
              />
          </div>
          <div className = "form-space"></div>
          <div className = "form-element form-element-divise-en-2" >
            <div>
             <Field
                name="tauxremplissageperiodebasse"
                type="text"
                component={renderField}
                placeholder = "70%"
                label="Taux de remplissage (en %)"
              />
            </div> 
          </div>          
        <p className = "form-explication-text">
            Période de l'année pendant laquelle l'entrepôt est le moins rempli
        </p>  
        </div>      

      <div style= {{float: "right", marginRight: "6rem", marginBottom: "6rem"}}>
        <button type="button" className="button-form button-next" onClick={previousPage}>
          Précédent
        </button>
        <button type="submit" className=" button-form button-next">Suivant</button>
      </div> 
    </form>
  );
};

export default reduxForm({
  form: 'wizard', //                 <------ same form name
  destroyOnUnmount: false, //        <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
  onSubmitFail: (errors) => scrollToFirstError(errors),  

})(WizardFormSecondPage);









                    <Popup
                      trigger={<button  className = 'button-add' > + Appel </button> }
                      on="focus"
                      position="right"
                      className = 'fiche-entrepot-popup'
                      modal
                      closeOnDocumentClick
                    >
                    {close => (
                      <div className = 'fiche-ent-popup-container'>
                        <h3 className = 'fiche-ent-pop-title'> Rajouter un appel dans le log </h3>
                        <div style = {{display: 'flex'}}>
                          <label className = 'fiche-ent-popup-label'> Responsable Spf </label>
                          <select value={this.state.conv_responsable_spf} onChange={this.handleChangeResponsableSpf}  className = 'fiche-ent-popup-input' id="conv_responsable_spf" >
                            <option value="" disabled selected>Responsable</option>
                            <option> Quentin </option>
                            <option> Maxime </option>
                            <option> Antoine </option>
                            <option> Paul </option>
                            <option> Gustave </option>
                            <option> Autre </option>
                          </select>                             
                        </div>
                        <div style = {{display: 'flex'}}>
                          <label className = 'fiche-ent-popup-label'> Commentaires </label>                        
                          <input type="text"   className = 'fiche-ent-popup-input' value={this.state.conv_commentaire} onChange={this.handleChangeConvCommentaires} />
                        </div>
                        <div style = {{display: 'flex'}}>
                          <label className = 'fiche-ent-popup-label'> Id demande </label>                                                
                          <input type="text"  className = 'fiche-ent-popup-input' value={this.state.conv_id_demande} onChange={this.handleChangeConvIdDemande} />
                        </div>
                        <div style = {{display: 'flex'}}>
                          <label className = 'fiche-ent-popup-label'> Note / 5</label>                                                
                          <StarRatingComponent 
                            name="rating appel/mail" 
                            starCount={5}
                            value={this.state.conv_note_sympathie}
                            onStarClick={this.handleChangeConvNoteSympathie}
                            className = 'fiche-entrepot-popup-star-input'
                          />
                        </div>
                        <div>
                          <button onClick = {() => {
                            close()
                            this.handleSubmitLog()
                          }} className = 'fiche-entrepot-popup-button'> Envoyer </button>  
                        </div>                
                                                                      
                      </div>
                      )}
                    </Popup>






import React from 'react'
import ReactTable from "react-table";
import 'react-table/react-table.css'
import store from '../store/store'
import { Link } from 'react-router-dom';
import Geocode from "react-geocode";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import Geosuggest from 'react-geosuggest';
import url_back_end from './Outils/Url'
import Select from 'react-select';


 import Autocomplete from 'react-google-autocomplete';

Geocode.setApiKey("AIzaSyD8oAu5BNwv7IrYmbgpCGXut59NMsmmzsI");
Geocode.enableDebug();


  function radians(degrees) {
      var TAU = 2 * Math.PI;
      return degrees * TAU / 360;
  }
  function compareDistance(a,b) {
    if (a.distance <= b.distance)
      return -1;
    if (a.distance >= b.distance)
      return 1;
    return 0;
  }  

  var s = 42.2
  var w = -4.94 
  var n = 51.2
  var e = 8.32
  var sw = new google.maps.LatLng( s, w );
  var ne = new google.maps.LatLng( n, e );


  const searchOptions = {
      bounds : new google.maps.LatLngBounds( sw, ne )
        // location: new google.maps.LatLng(6.63, 46.5),
        // radius: 10,
        // types: ['address']
  }

  const columns = [
    {Header: "Entrepot",
    columns: [{Header: "ID",accessor: "id", Cell: e =><Link to={`/fiche-entrepot/${e.value}`}> {e.value} </Link> },
              {Header: "Entreprise", accessor: 'entreprise'}, 
              {Header: "Ville", accessor: 'ville'},
              {Header: "Code Postal", accessor: 'code_postal'}, 
              {Header: "Distance", accessor: 'distance'}
              ]
      }, 
    {Header: "Contact",
    columns: [{Header: "Prenom",accessor: "contact_prenom", },
              {Header: "Nom", accessor: 'contact_nom'}, 
              {Header: "Téléphone", accessor: 'contact_telephone'}, 
              {Header: "Contact privilégié", accessor: 'spf_contact_privilegie'}, 
              {Header: "# Standard", accessor: 'numero_standard'}
              ]
      }   
  ]

  const columns_sirene =  [{Header: "ID",accessor: "id", },
              {Header: "Entreprise", accessor: 'entreprise'} ,
              {Header: "Ville", accessor: 'ville'},
              {Header: "Code Postal", accessor: 'code_postal'}, 
              {Header: "Distance", accessor: 'distance'},
              {Header: "Code Naf", accessor: 'code_naf'}, 
              {Header: "Code Naf du siège", accessor: 'code_naf_siege'}]             


  const options_departements = [
{value:  '01', label:'01'},
{value:  '02', label:'02'},
{value:  '03', label:'03'},
{value:  '04', label:'04'},
{value:  '05', label:'05'},
{value:  '06', label:'06'},
{value:  '07', label:'07'},
{value:  '08', label:'08'},
{value:  '09', label:'09'},
{value:  '10', label:'10'},
{value:  '11', label:'11'},
{value:  '12', label:'12'},
{value:  '13', label:'13'},
{value:  '14', label:'14'},
{value:  '15', label:'15'},
{value:  '16', label:'16'},
{value:  '17', label:'17'},
{value:  '18', label:'18'},
{value:  '19', label:'19'},
{value:  '20', label:'20'},
{value:  '21', label:'21'},
{value:  '22', label:'22'},
{value:  '23', label:'23'},
{value:  '24', label:'24'},
{value:  '25', label:'25'},
{value:  '26', label:'26'},
{value:  '27', label:'27'},
{value:  '28', label:'28'},
{value:  '29', label:'29'},
{value:  '30', label:'30'},
{value:  '31', label:'31'},
{value:  '32', label:'32'},
{value:  '33', label:'33'},
{value:  '34', label:'34'},
{value:  '35', label:'35'},
{value:  '36', label:'36'},
{value:  '37', label:'37'},
{value:  '38', label:'38'},
{value:  '39', label:'39'},
{value:  '40', label:'40'},
{value:  '41', label:'41'},
{value:  '42', label:'42'},
{value:  '43', label:'43'},
{value:  '44', label:'44'},
{value:  '45', label:'45'},
{value:  '46', label:'46'},
{value:  '47', label:'47'},
{value:  '48', label:'48'},
{value:  '49', label:'49'},
{value:  '50', label:'50'},
{value:  '51', label:'51'},
{value:  '52', label:'52'},
{value:  '53', label:'53'},
{value:  '54', label:'54'},
{value:  '55', label:'55'},
{value:  '56', label:'56'},
{value:  '57', label:'57'},
{value:  '58', label:'58'},
{value:  '59', label:'59'},
{value:  '60', label:'60'},
{value:  '61', label:'61'},
{value:  '62', label:'62'},
{value:  '63', label:'63'},
{value:  '64', label:'64'},
{value:  '65', label:'65'},
{value:  '66', label:'66'},
{value:  '67', label:'67'},
{value:  '68', label:'68'},
{value:  '69', label:'69'},
{value:  '70', label:'70'},
{value:  '71', label:'71'},
{value:  '72', label:'72'},
{value:  '73', label:'73'},
{value:  '74', label:'74'},
{value:  '75', label:'75'},
{value:  '76', label:'76'},
{value:  '77', label:'77'},
{value:  '78', label:'78'},
{value:  '79', label:'79'},
{value:  '80', label:'80'},
{value:  '81', label:'81'},
{value:  '82', label:'82'},
{value:  '83', label:'83'},
{value:  '84', label:'84'},
{value:  '85', label:'85'},
{value:  '86', label:'86'},
{value:  '87', label:'87'},
{value:  '88', label:'88'},
{value:  '89', label:'89'},
{value:  '90', label:'90'},
{value:  '91', label:'91'},
{value:  '92', label:'92'},
{value:  '93', label:'93'},
{value:  '94', label:'94'},
{value:  '95', label:'95'}
  ]

class RechercheEntrepots extends React.Component {
  constructor() {
    super()
    this.state = {
      entrepots : [], 
      adresse : '',
      latitude: '', 
      longitude: '', 
      nbEntrepots: 20, 
      typeStockage: 'tous', 
      entrepots_filtered: [], 
      loaded: false, 
      columns_final: columns, 
      problemeAuth: false, 
      entrepots_sirene: [],
      entrepots_sirene_sorted: [],
      loaded_sirene: false, 
      filtre_departements : []
    }
    this.getState = this.getState.bind(this);    
    this.handleChangeLatitude = this.handleChangeLatitude.bind(this);
    this.handleChangeLongitude = this.handleChangeLongitude.bind(this);
    this.handleChangeAdresse = this.handleChangeAdresse.bind(this); 
    this.getLonLat = this.getLonLat.bind(this); 
    this.getDistances = this.getDistances.bind(this);
    this.getDistancesSirene = this.getDistancesSirene.bind(this);
    this.handleChangeNbEntrepots = this.handleChangeNbEntrepots.bind(this);  
    this.handleChangeTypeStockage = this.handleChangeTypeStockage.bind(this); 
    this.handleChangeFiltreDepartement = this.handleChangeFiltreDepartement.bind(this);     
  }

  getState() {
    console.log(this.state)
    console.log(this.state.adresse)
  }

  getLonLat(adresse) {
    try {
    console.log('getting long et lat for ', adresse.description)

      Geocode.fromAddress(adresse.description + ' France').then(
        response => {
          const { lat, lng } = response.results[0].geometry.location;
          this.setState({latitude: lat, longitude: lng})
        },
        error => {
          console.error(error);
        }
      );           
    }
    catch(error){
      console.log(error)
    }
  }  


  getDistances() {
    const entrepots = this.state.entrepots
    const lat_x = this.state.latitude
    const lon_x = this.state.longitude
    const entrepots_new  = entrepots.map(function (e) {
      if ( isNaN(Number(e.latitude)) ||  isNaN(Number(e.longitude))){
        e.distance = 10000
        }
      else {
        const latitude_y = radians(Number(e.latitude))
        const longitude_y = radians(Number(e.longitude))
        const latitude_x = radians(Number(lat_x))
        const longitude_x = radians(Number(lon_x))
        // console.log(latitude_y, longitude_y, longitude_x, latitude_x)
        const a = Math.sin(Math.pow(((latitude_y - latitude_x)/2),2)) + Math.cos(latitude_y) * Math.cos(latitude_x) * Math.sin(Math.pow(((longitude_x - longitude_y)/2),2))
        const c = 2 * Math.atan2(Math.pow(a, 0.5), Math.pow(1-a, 0.5))
        // e.distance = String(Math.round(6371 * c)) + ' km'
        e.distance = Math.round(6371 * c) 
      }
      return e      
    });    
    // var entrepots_sorted = entrepots_new.sort(compareDistance);
    // var entrepots_sorted_with_km = entrepots_sorted.map(function(e){
    //   e.distance = String(e.distance) 
    //   return e
    // })
    if (this.state.filtre_departements.length > 0 ) {
          var liste = []
          this.state.filtre_departements.forEach(function(y) {
            entrepots_new.forEach(function(x) {
            if (x.code_postal.substring(0,2) === y.value) {
              liste.push(x)
              console.log(x)
              }
            })
          });
      liste = liste.sort(compareDistance);

      var liste_sorted = liste.map(function(e){
        e.distance = String(e.distance) + ' km'
        return e
      })          
          entrepots_sorted = liste_sorted
    }
    else {

      var entrepots_sorted = entrepots_new.sort(compareDistance);      
      var liste_sorted = entrepots_sorted.map(function(e){
        return String(e.distance) + 'km'
      })
    }  

    this.setState({entrepots: liste_sorted, entrepots_filtered: liste_sorted}); 

    if (this.state.typeStockage === 'Température ambiante') {
        const columns_temp = [
    {Header: "Entrepot",
    columns: [{Header: "ID",accessor: "id", Cell: e =><Link to={`/fiche-entrepot/${e.value}`}> {e.value} </Link>},
              {Header: "Entreprise", accessor: 'entreprise'}, 
              {Header: "Ville", accessor: 'ville'},
              {Header: "Code Postal", accessor: 'code_postal'}, 
              {Header: "Distance", accessor: 'distance'}
              ]
      }, 
    {Header: "Contact",
    columns: [{Header: "Prenom",accessor: "contact_prenom", },
              {Header: "Nom", accessor: 'contact_nom'}, 
              {Header: "Téléphone", accessor: 'contact_telephone'}, 
              {Header: "Contact privilégié", accessor: 'spf_contact_privilegie'}, 
              {Header: "# Standard", accessor: 'numero_standard'}
              ]
      }   
  ]
      columns_temp[0].columns.push({Header: "Ambient taille", accessor: "ambient_couvert_taille" })
      this.setState({columns_final: columns_temp})
      var entrepots_filtered = this.state.entrepots.filter(function (e) {
        return e.ambiant_couvert != 'Non' 
      });
      if (this.state.filtre_departements.length > 0 ) {
        var liste = []
        this.state.filtre_departements.forEach(function(y) {
          entrepots_filtered.forEach(function(x) {
          if (x.code_postal.substring(0,2) === y.value) {
            liste.push(x)
            console.log(x)
            }
          })
        });
      var liste_sorted = liste.map(function(e){
        e.distance = String(e.distance) + ' km'
        return e
      })          
        entrepots_filtered = liste_sorted
      }    
    else {

      var entrepots_sorted = entrepots_filtered.sort(compareDistance);      
      var liste_sorted = entrepots_sorted.map(function(e){
        return String(e.distance) + 'km'
      })
    }  

      this.setState({entrepots_filtered: entrepots_filtered});      
      };


    if (this.state.typeStockage === 'Froid positif') {
              const columns_temp = [
    {Header: "Entrepot",
    columns: [{Header: "ID",accessor: "id", Cell: e =><Link to={`/fiche-entrepot/${e.value}`}> {e.value} </Link>},
              {Header: "Entreprise", accessor: 'entreprise'}, 
              {Header: "Ville", accessor: 'ville'},
              {Header: "Code Postal", accessor: 'code_postal'}, 
              {Header: "Distance", accessor: 'distance'}
              ]
      }, 
    {Header: "Contact",
    columns: [{Header: "Prenom",accessor: "contact_prenom", },
              {Header: "Nom", accessor: 'contact_nom'}, 
              {Header: "Téléphone", accessor: 'contact_telephone'}, 
              {Header: "Contact privilégié", accessor: 'spf_contact_privilegie'}, 
              {Header: "# Standard", accessor: 'numero_standard'}
              ]
      }   
  ]
      columns_temp[0].columns.push({Header: "Frais taille", accessor: "frais_taille" })
      this.setState({columns_final: columns_temp})
      var entrepots_filtered = this.state.entrepots.filter(function (e) {
        return e.frais != 'Non' });
      if (this.state.filtre_departements.length > 0 ) {
        var liste = []
        this.state.filtre_departements.forEach(function(y) {
          entrepots_filtered.forEach(function(x) {
          if (x.code_postal.substring(0,2) === y.value) {
            liste.push(x)
            console.log(x)
            }
          })
        });
      var liste_sorted = liste.map(function(e){
        e.distance = String(e.distance) + ' km'
        return e
      })             
        entrepots_filtered = liste_sorted
      }
      else {

        var entrepots_sorted = entrepots_filtered.sort(compareDistance);      
        var liste_sorted = entrepots_sorted.map(function(e){
          return String(e.distance) + 'km'
        })
      }        

    this.setState({entrepots_filtered: entrepots_filtered});      
    };
    if (this.state.typeStockage === 'Froid négatif') {
              const columns_temp = [
    {Header: "Entrepot",
    columns: [{Header: "ID",accessor: "id", Cell: e =><Link to={`/fiche-entrepot/${e.value}`}> {e.value} </Link>},
              {Header: "Entreprise", accessor: 'entreprise'}, 
              {Header: "Ville", accessor: 'ville'},
              {Header: "Code Postal", accessor: 'code_postal'}, 
              {Header: "Distance", accessor: 'distance'}
              ]
      }, 
    {Header: "Contact",
    columns: [{Header: "Prenom",accessor: "contact_prenom", },
              {Header: "Nom", accessor: 'contact_nom'}, 
              {Header: "Téléphone", accessor: 'contact_telephone'}, 
              {Header: "Contact privilégié", accessor: 'spf_contact_privilegie'}, 
              {Header: "# Standard", accessor: 'numero_standard'}
              ]
      }   
  ]
      columns_temp[0].columns.push({Header: "Surgele taille", accessor: "surgele_taille" })
      this.setState({columns_final: columns_temp})
      var entrepots_filtered = this.state.entrepots.filter(function (e) {
        return e.surgele != 'Non' });
      if (this.state.filtre_departements.length > 0 ) {
        var liste = []
        this.state.filtre_departements.forEach(function(y) {
          entrepots_filtered.forEach(function(x) {
          if (x.code_postal.substring(0,2) === y.value) {
            liste.push(x)
            console.log(x)
            }
          })
        });
      var liste_sorted = liste.map(function(e){
        e.distance = String(e.distance) + ' km'
        return e
      })         
        entrepots_filtered = liste_sorted
      }
      else {

        var entrepots_sorted = entrepots_filtered.sort(compareDistance);      
        var liste_sorted = entrepots_sorted.map(function(e){
          return String(e.distance) + 'km'
        })
      }      
        
      this.setState({entrepots_filtered: entrepots_filtered});      

    };
    if (this.state.typeStockage === 'Stockage extérieur') {
              const columns_temp = [
    {Header: "Entrepot",
    columns: [{Header: "ID",accessor: "id", Cell: e =><Link to={`/fiche-entrepot/${e.value}`}> {e.value} </Link>},
              {Header: "Entreprise", accessor: 'entreprise'}, 
              {Header: "Ville", accessor: 'ville'},
              {Header: "Code Postal", accessor: 'code_postal'}, 
              {Header: "Distance", accessor: 'distance'}
              ]
      }, 
    {Header: "Contact",
    columns: [{Header: "Prenom",accessor: "contact_prenom", },
              {Header: "Nom", accessor: 'contact_nom'}, 
              {Header: "Téléphone", accessor: 'contact_telephone'}, 
              {Header: "Contact privilégié", accessor: 'spf_contact_privilegie'}, 
              {Header: "# Standard", accessor: 'numero_standard'}
              ]
      }   
  ]
      columns_temp[0].columns.push({Header: "Exterieur taille", accessor: "ambient_exterieur_taille" })
      this.setState({columns_final: columns_temp})
      var entrepots_filtered = this.state.entrepots.filter(function (e) {
        return e.ambiant_exterieur != 'Non' });

      if (this.state.filtre_departements.length > 0 ) {
        var liste = []
        this.state.filtre_departements.forEach(function(y) {
          entrepots_filtered.forEach(function(x) {
          if (x.code_postal.substring(0,2) === y.value) {
            liste.push(x)
            console.log(x)
            }
          })
        });
      var liste_sorted = liste.map(function(e){
        e.distance = String(e.distance) + ' km'
        return e
      })          
        entrepots_filtered = liste_sorted
      }
      else {

        var entrepots_sorted = entrepots_filtered.sort(compareDistance);      
        var liste_sorted = entrepots_sorted.map(function(e){
          return String(e.distance) + 'km'
        })
      }        
        
    this.setState({entrepots_filtered: entrepots_filtered});      
    };            

  }


  getDistancesSirene() {
    const entrepots_sirene = this.state.entrepots_sirene
    const lat_x = this.state.latitude
    const lon_x = this.state.longitude
    const entrepots_new  = entrepots_sirene.map(function (e) {
      if ( isNaN(Number(e.lat)) ||  isNaN(Number(e.lon))){
        e.distance = 10000
        }
      else {
        const latitude_y = radians(Number(e.lat))
        const longitude_y = radians(Number(e.lon))
        const latitude_x = radians(Number(lat_x))
        const longitude_x = radians(Number(lon_x))
        // console.log(latitude_y, longitude_y, longitude_x, latitude_x)
        const a = Math.sin(Math.pow(((latitude_y - latitude_x)/2),2)) + Math.cos(latitude_y) * Math.cos(latitude_x) * Math.sin(Math.pow(((longitude_x - longitude_y)/2),2))
        const c = 2 * Math.atan2(Math.pow(a, 0.5), Math.pow(1-a, 0.5))
        // e.distance = String(Math.round(6371 * c)) + ' km'
        e.distance = Math.round(6371 * c) 
      }
      return e      
    });    
    const entrepots_sirene_sorted = entrepots_new.sort(compareDistance);
    const entrepots_sirene_sorted_with_km = entrepots_sirene_sorted.map(function(e){
      e.distance = String(e.distance) + ' km'
      return e
    })
    this.setState({entrepots_sirene_sorted: entrepots_sirene_sorted_with_km}); 
  }




  handleChangeLatitude(event) {
    this.setState({latitude: event.target.value});
  }  
  handleChangeAdresse(adresse) {
    try {
      console.log('adresse to ' + adresse)
      this.setState({adresse: adresse})
    }
    catch(error){
      console.log('a')
    }
  }  

   
  handleChangeLongitude(event) {
    this.setState({longitude: event.target.value});
  }    
  handleChangeNbEntrepots(event) {
    this.setState({nbEntrepots: event.target.value});
  }    
  handleChangeTypeStockage(event) {
    this.setState({typeStockage: event.target.value});
  }      
  handleChangeFiltreDepartement(selectedOption){
    this.setState({filtre_departements: selectedOption})
  }


  async componentDidMount() {
    if (store.getState().authentication.isAuthenticated){
      console.log('it is authenticated')
    try {
      const response = await fetch( url_back_end + '/entrepots')
      // const response = await fetch('http://localhost:3000/entrepots')
      const json = await response.json();     
      this.setState({ entrepots: json , loaded: true, entrepots_filtered : json});
    } catch (error) {
      console.log(error);
    }
    try {
      // const response = await fetch('http://localhost:
      // /entrepots_siren')
      // const response = await fetch('http://localhost:3000/entrepots_siren')

      const response = await fetch(url_back_end + '/entrepots_siren')
      const json = await response.json();     
      this.setState({ entrepots_sirene: json , loaded_sirene: true, entrepots_sirene_sorted : json});
    } catch (error) {
      console.log(error);
    }    
    }
    if (!store.getState().authentication.isAuthenticated){
    this.setState({problemeAuth: true})
    }
  }

    render() {
      return(
        <div> 
          <Link to ='accueil' >
            <h5 className = 'ajout_entrepot_margin'> Accueil </h5>
          </Link>         
          <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD8oAu5BNwv7IrYmbgpCGXut59NMsmmzsI&libraries=places"></script>
          <h3 className = 'recherche_entrepots_title'> Faire une recherche d'entrepot </h3>
          {this.state.problemeAuth && 
            <div> 
              <h4> probleme d'identification </h4>
                <Link to = '/' >
                  <button > Retour à l'identification </button>
                </Link>
            </div>
          }
          {!this.state.problemeAuth &&
            <div style = {{fontSize: '0.9rem'}}>                     
              <div className = 'recherche_entrepots_inputs_box'>
                <div className = 'recherche_entrepots_input'> 
                  <p className = 'recherche_entrepots_label'> 
                    Adresse 
                  </p>
                  <Geosuggest
                    placeholder="Géolocation"  
                    value = {this.state.adresse}                                      
                    onChange = {this.handleChangeAdresse}
                    onSuggestSelect={this.getLonLat}
                    country = 'fr'
                    queryDelay = {600}
                    highlightMatch = {false}
                    types={['(regions)']}
                  />

                </div>
                <div className = 'recherche_entrepots_input'>
                  <p className = 'recherche_entrepots_label'> Type de stockage </p>
                  <select value={this.state.typeStockage} onChange={this.handleChangeTypeStockage} id="typeStockage"   className = "recherche-entrepot-container-input">
                    <option> Tous </option>
                    <option> Température ambiante </option>
                    <option> Froid positif </option>
                    <option> Froid négatif </option>
                    <option> Stockage extérieur </option>
                  </select>
                </div>

                <div className = 'recherche_entrepots_input'>
                  <p className = 'recherche_entrepots_label'> Filtre département </p>

                  <Select
                    value={this.state.filtre_departements}
                    onChange={this.handleChangeFiltreDepartement}
                    options={options_departements}
                    className = 'recherche-entrepot-container-input recherche-entrepot-departement'
                    style = {{width: '85%'}}
                    isMulti = {true}
                  />   
                </div>

                <div className = 'recherche_entrepots_input'>
                  <button className = 'recherche_entrepots_boutton' style = {{marginLeft: '2rem'}} onClick = {this.getDistances} > Calcul </button>         
                </div> 
              </div> 
              <div className = 'recherche_entrepots_inputs_box' style = {{marginTop: '-1rem'}}>                
                <div className = 'recherche_entrepots_input'> 
                  <p className = 'recherche_entrepots_label'> 
                    Latitude 
                  </p>
                  <input type="text" value={this.state.latitude} onChange={this.handleChangeLatitude} className = 'fiche-entrepot-input' style = {{width: '11.2rem'}}/>          
                </div>
                <div className = 'recherche_entrepots_input'> 
                  <p className = 'recherche_entrepots_label'> 
                    Longitude 
                  </p>
                  <input type="text" value={this.state.longitude} onChange={this.handleChangeLongitude} className = 'fiche-entrepot-input' style = {{width: '11.2rem'}}/>                
                </div>
                <div style = {{flex: '4'}}> 
                </div>
              </div>
              {!this.state.loaded &&
                <div className = 'recherche_entrepots_loading'> Loading ... </div> }
              {this.state.loaded && <div className = 'recherche_entrepots_loaded'> Loaded </div> 
              }          
           
              <div className = 'page-container'>
                  <ReactTable data={this.state.entrepots_filtered} columns={this.state.columns_final} 
                  className="-striped -highlight" filterable  
                  defaultPageSize= {20}
                  />

              </div>          

              <div > 
                <h3 style = {{marginTop: '10rem', textAlign: 'center', fontSize: '2rem'}}> Entrepots de la BDD Sirene </h3>
                <div className = 'recherche_entrepots_input'>
                  <button className = 'recherche_entrepots_boutton' onClick = {this.getDistancesSirene} > Calcul Sirene </button>         
                </div>  
                <div>
                  <ReactTable data={this.state.entrepots_sirene_sorted} columns={columns_sirene} 
                  className="-striped -highlight" filterable  
                  defaultPageSize= {20}
                  /> 
                </div>               

              <div className = 'page-container'>


              </div>                 
              
              </div>

              <button onClick = {this.getState} >GetState </button>
            </div>




        }
        </div> 
      )
    }
}
      
export default RechercheEntrepots; 

                    // onSelect={this.getLonLat}


                // <div className = 'recherche_entrepots_input'> 
                //   <p className = 'recherche_entrepots_label'> 
                //     Latitude 
                //   </p>
                //   <input type="text" onChange={this.handleChangeLatitude} value={this.state.latitude}   className = 'form-group recherche-entrepot-container-input' />
                // </div>
                // <div className = 'recherche_entrepots_input'>
                //   <p className = 'recherche_entrepots_label'>
                //     Longitude
                //   </p>
                //   <input type="text" onChange={this.handleChangeLongitude} value={this.state.longitude}  className = 'form-group recherche-entrepot-container-input' />          
                // </div>
                  // <ReactTable data={this.state.entrepots_sirene} columns={this.state.columns_sirene} 
                  // className="-striped -highlight" filterable  
                  // defaultPageSize= {20}
                  // />

//                <ReactTable data={this.state.entrepots_sirene} columns={this.state.columns_sirene} 
                  //className="-striped -highlight" filterable  
                 //defaultPageSize= {20} />     
              // <div style = {{marginTop: '4rem'}}> 
              //   <h3> Entrepots de la BDD Sirene </h3>
              //   <div className = 'recherche_entrepots_input'>
              //     <button className = 'recherche_entrepots_boutton' onClick = {this.getDistancesSirene} > Calcul Sirene </button>         
              // //   </div>      
              //   <ReactTable data={this.state.entrepots_sirene_sorted} columns={this.state.columns_sirene} 
              //     className="-striped -highlight" filterable  
              //     defaultPageSize= {20} />                              
             

              // </div>
              // {!this.state.loaded_sirene &&
              //   <div className = 'recherche_entrepots_loading'> Loading ... </div> }
              // {this.state.loaded_sirene && <div className = 'recherche_entrepots_loaded'> Loaded </div> 
              // }      
              // 
              //                   getTrProps={(state, rowInfo, column, instance) => ({
                  //   onClick: e => this.props.history.push('/')
                  // }) 


//  <PlacesAutocomplete  options={{  componentRestrictions: {country: 'fr'}}} 
                //   value={this.state.adresse} onChange={this.handleChangeAdresse} onSelect={this.getLonLat}  > 
                //       {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                //         <div>
                //           <input
                //             {...getInputProps({
                //               placeholder: "Lieu souhaité",
                //             })}  className = "recherche-entrepot-container-input"
                //           />
                //           <div className="autocomplete-dropdown-container">
                //             {loading && <div>Loading...</div>}
                //             {suggestions.map(suggestion => {
                //               const className = suggestion.active
                //                 ? 'suggestion-item--active'
                //                 : 'suggestion-item';
                //               // inline style for demonstration purpose
                //               const style = suggestion.active
                //                 ? { backgroundColor: '#D8D8D8', cursor: 'pointer', minHeight: '1.7rem' }
                //                 : { backgroundColor: '#FAFAFA', cursor: 'pointer', border: '0.2px solid #D8D8D8', minHeight: '1.7rem' };
                //               return (
                //                 <div
                //                   {...getSuggestionItemProps(suggestion, {
                //                     className,
                //                     style,
                //                   })}
                //                 >
                //                   <span>{suggestion.description}</span>
                //                 </div>
                //               );
                //             })}
                //           </div>
                //         </div>
                //       )}
                // </PlacesAutocomplete>
                // 
                // 
                // // 
                // <Autocomplete
                //       style={{width: '90%'}}
                //       onChange={(place) => {
                //         console.log(place); 
                //         this.setState({adresse: place.formatted_address})}
                //       }
                //       onPlaceSelected={(place) => {
                //         {this.getLonLat}      
                //       }                    
                //       }
                //       types={['(cities)']}
                //       className = "recherche-entrepot-container-input"
                //       componentRestrictions={{country: "fr"}}
                //   />                  
                //                 

