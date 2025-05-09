;(function(window, angular) {

  'use strict';

  // Application module
  angular.module('app', [
    'ui.router',
		'app.common',
		'app.form',
		'app.user',
		'app.message',
		'app.counter'
  ])

  // Application config
  .config([
    '$stateProvider', 
    '$urlRouterProvider', 
    ($stateProvider, $urlRouterProvider) => {

      $stateProvider
      .state('root', {
				abstract: true,
				views: {
					'@': {
						templateUrl: './html/root.html'
					},
					'header_top@root': {
						templateUrl: './html/header_top.html'
					},
					'header_nav@root': {
						templateUrl: './html/header_nav.html'
					},
					'footer@root': {
						templateUrl: './html/footer.html',
						controller: 'footerController'
					},
					'modal@root': {
            template: `<ng-message audio-url="'./media/audio/error.mp3'">
                       </ng-message>`
          }
				}
      })
			.state('root2', {
				abstract: true,
				views: {
					'@': {
						templateUrl: './html/root2.html'
					},
					'header_nav2@root2': {
						templateUrl: './html/header_nav2.html',
						controller: 'headerNav2Controller'
					},
					'modal@root2': {
            template: `<ng-message audio-url="'./media/audio/error.mp3'">
                       </ng-message>`
          }
				}
      })
			.state('home', {
				url: '/',
				parent: 'root',
				templateUrl: './html/home.html',
				controller: 'homeController'
			})
			.state('about_us', {
				url: '/about_us',
				parent: 'root',
				templateUrl: './html/about_us.html',
				controller: 'aboutUsController'
			})
			.state('worker', {
				url: '/worker',
				parent: 'root',
				templateUrl: './html/worker.html',
				controller: 'workerController'
			})
			.state('gallery', {
				url: '/gallery',
				parent: 'root',
				templateUrl: './html/gallery.html',
				controller: 'galleryController'
			})
			.state('relationship', {
				url: '/relationship',
				parent: 'root',
				templateUrl: './html/relationship.html',
				controller: 'relationshipController',
				params: {type: null}
			})
			.state('user', {
				url: '/user',
				parent: 'root',
				templateUrl: './html/user.html',
				controller: 'userController'
			})
			.state('profile', {
				url: '/profile',
				parent: 'root',
				templateUrl: './html/profile.html',
				controller: 'profileController'
			})
			.state('types', {
				url: '/types',
				parent: 'root2',
				templateUrl: './html/tables.html',
				controller: 'tablesController',
				params: {
					url: 'types',
					str: 'types'
				}
			})
			.state('offices', {
				url: '/offices',
				parent: 'root2',
				templateUrl: './html/tables.html',
				controller: 'tablesController',
				params: {
					url: 'offices',
					str: 'offices'
				}
			})
			.state('tasks', {
				url: '/tasks',
				parent: 'root2',
				templateUrl: './html/tables.html',
				controller: 'tablesController',
				params: {
					url: 'tasks',
					str: 'tasks',
					type: null
				}
			})
			.state('users', {
				url: '/users',
				parent: 'root2',
				templateUrl: './html/tables.html',
				controller: 'tablesController',
				params: {
					url: 'users',
					str: 'users'
				}
			})
			.state('workers', {
				url: '/workers',
				parent: 'root2',
				templateUrl: './html/tables.html',
				controller: 'tablesController',
				params: {
					url: 'workers',
					str: 'workers'
				}
			})
			.state('contract', {
				url: '/contract',
				parent: 'root2',
				templateUrl: './html/tables.html',
				controller: 'tablesController',
				params: {
					url: 'contracts',
					str: 'contracts',
					type: null
				}
			});
      
      $urlRouterProvider.otherwise('/');
    }
  ])

  // Application run
  .run([
		'$rootScope',
		'$timeout',
    'trans',
		'user',
		'util',
		'http',
		'form',
    ($rootScope, $timeout, trans, user, util, http, form) => {

			// Set is user data completted
			$rootScope.isUserDataCompleted = null;

			// Watch user changed
			$rootScope.$watch('user.id', (newValue, oldValue) => {

				// Check is changed
				if(!angular.equals(newValue, oldValue)) {
					if (newValue) {
						http.request({
							url: './php/isUserDataCompletted.php',
							data: {id: newValue}
						})
						.then(response => {
							$rootScope.isUserDataCompleted = response;
							$rootScope.$applyAsync();
							$timeout(() => form.tooltips());
						})
						.catch(e => {
							console.log(e);
							$rootScope.isUserDataCompleted = false;
							$rootScope.$applyAsync();
						});
					} else {
						$rootScope.isUserDataCompleted = false;
						$rootScope.$applyAsync();
					}
				}
			});

      // Transaction events
			trans.events([
				'user',
				'profile',
				'tasks',
				'users',
				'workers',
				'contract',
				'types',
				'offices'
			], () => {

				// Reset asynchronity
				$timeout(() => {

					// Initialize intersection observer on image content
					util.intersectionObserverInit('.image-content', 
					(element, isIntersecting) => {
	
						// When is not in view, then toggle class from
						if (!isIntersecting) {
							element.classList.toggle('from-left');
							element.classList.toggle('from-right');
						}
					});
				}, 300);
			});

			// User initialize
			user.init({
				id			: null,
				type  	: null,
				rank		: null,
				ranking	: null,
				superior: null,
				name  	: null
			}, () => {

				// Check user valid
				let isUserValid = (data) => {
					return new Promise((resolve, reject) => {
						http.request({
							url: './php/isUserValid.php',
							data: data
						})
						.then(response => resolve(response))
						.catch(e => reject(e));
					});
				};

				// Get/Check user saved properties
				let prop = util.localStorage('get', 'user_id');
				if (prop) {
					isUserValid(prop)
					.then(response => {
						user.set(response);
					})
					.catch((e) => console.log(e));
				}
			});
    }
  ])

	// Home controller
  .controller('homeController', [
		'$scope',
		'http',
    function($scope, http) {

			// Get advertisement
			http.request('./php/advertisement.php')
			.then(response => {
				$scope.data = response;
				$scope.$applyAsync();
			})
			.catch(e => console.log(e));
		}
	])

	// About us controller
  .controller('aboutUsController', [
    '$scope',
    '$timeout',
		'util',
		'counter',
		'http',
    function($scope, $timeout, util, counter, http) {

			// Set methods
			let methods = {

				// Initialize
				init: () => {

					// Get data
					methods.get().then(() => {

						// Counter
						methods.counter();
					});
				},

				// Get data
				get: () => {

					// Create promise
					return new Promise((resolve, reject) => {
						
						// Get data
						http.request('./php/data.php')
						.then(response => {

							// Set response, and apply change
							$scope.data = response;
							$scope.$applyAsync();

							// Resolve
							resolve();
						})
						.catch(e => {
							console.log(e);
							reject();
						});
					});
				},

				// Counter
				counter: () => {

					// Set counters
					$scope.counters = [
						{total:5, content:'régióval'}, 
						{total:200, content:'tanácsadóval'},
						{total:46000, content:'ügyféllel'}
					];

					// Initialize counter
					counter.init();

					// Initialize intersection observer on counter
					util.intersectionObserverInit('.counter-container', 
					(element, isIntersecting) => {

						// Check is in view
						if (isIntersecting)
									counter.start();
						else 	$timeout(() => counter.stop(true));
					});
				}
			};

			// Initialize
			methods.init();
		}
	])

	// Worker controller
  .controller('workerController', [
    '$scope',
		'http',
		'msg',
    function($scope, http, msg) {

			// Set item index
			$scope.itemIndex = -1;

			// Http request
			http.request(`./php/worker.php`)
			.then(response => {

				// Set response, and apply changes
				$scope.data = response;
				$scope.$applyAsync();
			})
			.catch(e =>

				// Show error
				msg.show({
					icon		: "text-danger fa-solid fa-circle-exclamation",
					title 	: "Hiba",
					content	: e
				})
			);

			// Set scope methods
			$scope.methods = {

				// Item clicked
				itemClicked: (idCard) => {
					$scope.idCard = idCard;
					$scope.$applyAsync();
				}
			};
		}
	])
	
	// Gallery controller
  .controller('galleryController', [
		'$rootScope',
    '$scope',
		'http',
		'msg',
    function($rootScope, $scope, http, msg) {

			// Set item index
			$scope.itemIndex = -1;

			// Http request
			http.request(`./php/${$rootScope.state.id}.php`)
			.then(response => {

				// Set response, and apply changes
				$scope.data = response;
				$scope.$applyAsync();
			})
			.catch(e =>

				// Show error
				msg.show({
					icon		: "text-danger fa-solid fa-circle-exclamation",
					title 	: "Hiba",
					content	: e
				})
			);

			// Set scope methods
			$scope.methods = {

				// Item clicked
				itemClicked: (event) => {
					let element = event.currentTarget;
					if (element) {
						let index = element.dataset.index;
						if (index) {
							index = parseInt(index);
							if (!isNaN(index)) {
								$scope.itemIndex = index;
								$scope.$applyAsync();
							}
						}
					}
				},

				// Change image
				changeImage: (event) => {
					let element = event.currentTarget;
					if (element) {
						let dataCount = $rootScope.state.id === 'worker' ? 
														$scope.data.length :
														$scope.data.gallery.length;
						if (element.classList.contains('fa-angle-right')) {
							if ($scope.itemIndex < dataCount - 1)
										$scope.itemIndex++;
							else	$scope.itemIndex = 0;
						} else {
							if ($scope.itemIndex > 0)
										$scope.itemIndex--;
							else	$scope.itemIndex = dataCount - 1;
						} 
						$scope.$applyAsync();
					}
				}
			};
		}
	])

	// Relationship controller
  .controller('relationshipController', [
		'$stateParams',
		'$rootScope',
		'$scope',
		'$timeout',
		'http',
		'util',
		'trans',
		'msg',
    function($stateParams, $rootScope, $scope, $timeout, http, util, trans, msg) {

			// Set local methods
			let methods = {

				// Initialize
				init: () => {

					// Set model
					$scope.model = {
						name: null,
						email: null,
						phone: null
					};

					// Get types
					methods.getTypes();

					// Get user
					methods.getUser();
				},

				// Get types
				getTypes: () => {

					// Http request
					http.request({
						url:'./php/getTypes.php',
						data: {type: 'TASK'}
					})
					.then(response => {

						// Set response
						$scope.types = response;

						// Check state params exist
						let index = util.indexByKeyValue(
							$scope.types, 'id', $stateParams.type
						);

						// When exist set 
						if (index !== -1)
									$scope.model.type = $scope.types[index];
						else	$scope.model.type = null;

						// Apply change
						$scope.$applyAsync();
					})
					.catch(e => methods.error(e));
				},

				// Get user
				getUser: () => {

					// Check user is logged
					if ($rootScope.user.id) {

						// Set user name
						$scope.model.name = $rootScope.user.name;

						// Http request
						http.request({
							url: './php/getUser.php',
							data: {id: $rootScope.user.id}
						})
						.then(response => {

							// Set user properties
							$scope.model.email = response.email;
							$scope.model.phone = response.phone;

							// Apply change
							$scope.$applyAsync();
						})
						.catch(e => methods.error(e));
					}
				},

				// Show error
				error: (e) => {
					msg.show({
						icon		: "text-danger fa-solid fa-circle-exclamation",
						title 	: "HIBA",
						content	: e
					});
				}
			};

			// Set scope methods
			$scope.methods = {

				// Accept
				accept: () => {

					// Set request data
					let data 			= util.objFilterByKeys($scope.model, 'type', false);
					data.type 		= $scope.model.type.id;
					data.user_id 	= $rootScope.user.id;

					// Http request
					http.request({
						url 	: './php/relationship.php',
						method: 'POST',
						data 	: data
					})
					.then(response => {

						// Go to prevent enabled state
						trans.preventState();

						// Show message
						$timeout(() => {
							msg.show({
								icon		: "text-success fa-solid fa-circle-check",
								title 	: "Jelenkezés",
								content	: response
							});
						}, 100);
					})
					.catch(e => methods.error(e));
				}
			};

			// Initialize
			methods.init();
		}
	])

	// Footer controller
  .controller('footerController', [
    '$scope',
    function($scope) {
			$scope.currentYear = moment().year();
		}
	])

	// User controller
  .controller('userController', [
    '$scope',
		'$timeout',
		'http',
		'user',
		'msg',
		'util',
		'trans',
		'form',
    function($scope, $timeout, http, user, msg, util, trans, form) {
			
			// Set model
			$scope.model = {
				login: {
					email: util.localStorage('get', 'email')
				}, 
				register: {},
				frogotPassword: {}
			};

			// Set is show overlay left panel
			$scope.isShowOverlayLeftPanel = false;

			// Set is show frogot password form
			$scope.isShowFrogotPasswordForm = false;

			// Set local methods
			let methods = {

				// Initialize
				init: () => {

					// Get user sign container
					let userSignContainer = document.querySelector('.user-sign-container');
					if (userSignContainer)
						userSignContainer.classList.add('scaleUpCenter');

					// Set focus
					form.focus('form.login-form');

					// Initialize tooltips
					form.tooltips();
				}, 
				
				// Reset model
				reset: () => {
					Object.keys($scope.model).forEach(type => {
						Object.keys($scope.model[type]).forEach(key => {
							if (key.includes('password') || 
									key.includes('confirm'))
								$scope.model[type][key] = null;
						});
					});
				},

				// Set focus
				focus: (isShowFrogotPasswordForm, delay=0) => {
					if (!util.isInt(delay) || delay < 0) delay = 0;
					if ($scope.isShowOverlayLeftPanel) {
						if (isShowFrogotPasswordForm)
									form.focus('form.frogot-password-form', delay);
						else 	form.focus('form.register-form', delay);
					} else 	form.focus('form.login-form', delay);
				}
			}

			// Set scope methods
			$scope.methods = {

				// Accept
				accept: (type) => {

					// Set not allowed keys for request data
					let notAllowedKeys = ['show_password','password_confirm',
																'email_confirm', 'stay_logged_in'];
					let data = 	Object.fromEntries(
											Object.entries($scope.model[type])
														.filter(([k]) => !notAllowedKeys.includes(k)));

					http.request({
						url: `./php/${type}.php`,
						data: data
					})
					.then(response => {
						switch(type) {
							case 'login':
								user.set(response);
								if ($scope.model.login.stay_logged_in)
											util.localStorage('set', 'user_id', 
											util.objFilterByKeys(response, 'id'));
								else	util.localStorage('remove', 'user_id'); 
								break;
							case 'register':
								data.id = response;
								user.set(data);
								util.localStorage('remove', 'user_id');
								break;
							case 'frogotPassword':
								msg.show({
									icon		: "text-primary fa-solid fa-circle-info",
									content	: response
								});
								break;
						}
						if (type !== 'frogotPassword')
							util.localStorage('set', 'email', data.email);
						trans.preventState();
					})
					.catch(error => {
						msg.show({
							icon		: "text-danger fa-solid fa-circle-exclamation",
							title 	: "hiba",
							content	: error,
							callback  : () => {
								methods.reset();
								methods.focus($scope.isShowFrogotPasswordForm, 200);
							}
						});
					});
				},

				// Toggle
				toggle: (isShowFrogotPasswordForm=false) => {
	
					// Toggle 
					$scope.isShowOverlayLeftPanel = !$scope.isShowOverlayLeftPanel;

					// Check is show frogot password form
					if (isShowFrogotPasswordForm)
						$scope.isShowFrogotPasswordForm = isShowFrogotPasswordForm;
					
					// Reset model values
					methods.reset();

					// Check is not show frogot password form
					if (!isShowFrogotPasswordForm) {
						$timeout(() => {
							$scope.isShowFrogotPasswordForm = isShowFrogotPasswordForm;
							$scope.$applyAsync();
						}, 600);
					}

					// Set focus
					methods.focus(isShowFrogotPasswordForm, 600);

					// Initialize tooltips
					form.tooltips();
				},

				// Cancel
				cancel: () => {
					trans.preventState();
				}
			}

			// Initialize
			methods.init();
		}
	])

	// Profile controller
  .controller('profileController', [
		'$rootScope',
    '$scope',
		'util',
		'http',
		'user',
		'form',
		'msg',
		'trans',
    function($scope, $rootScope, util, http, user, form, msg, trans) {

			// Set local methods
			let methods = {

				// Initialize
				init: () => {
					
					// Set helpoer
					$scope.helper = {
						isInEditMode: false,
						isModelChanged: false,
						userProperties: null,
						modelFormKey: 'profile',
						currentPassword: null
					}
					$scope.helper.maxBorn = 
							moment().subtract(18, 'years').format('YYYY-MM-DD');
					$scope.helper.minBorn = 
							moment().subtract(120, 'years').format('YYYY-MM-DD');

					// Set model from user properties
					$scope.model = {
						profile: user.get(),
						password: null,
						email: null
					}

					// Get rest user properties
					methods.get().then(() => {

						// Set events
						methods.events();

						let element = document.querySelector('#profile-dialog');
						if (element) {
							let modal = new bootstrap.Modal(element);
							modal.show();
						}
					});
				}, 

				// Get
				get: () => {

					// Create promise
					return new Promise((resolve, reject) => {
						
						// Get data
						http.request({
							url: './php/getUserProperties.php',
							data: {id: $rootScope.user.id}
						})
						.then(response => {

							// Set current email, and passord
							$scope.helper.currentEmail 		= response.email;
							$scope.helper.currentPassword = response.password;
							delete response.password;

							// Convert date
							if (util.isObjectHasKey(response, 'born') &&
									!util.isNull(response.born))
								response.born = moment(response.born).toDate();

							// Merge model with response
							$scope.model.profile = util.objMerge($scope.model.profile, response);

							// Save user properties
							$scope.helper.userProperties = util.objMerge({}, $scope.model.profile);

							// Apply change, and resolve
							$scope.$applyAsync();
							resolve();
						})
						.catch(e => {
							msg.show({
								icon		: "text-danger fa-solid fa-circle-exclamation",
								title 	: "Hiba",
								content	: e
							});
							reject();
						});
					});
				},

				// Events
				events: () => {

					// Watch task pointer changed
					$scope.$watch('model.profile', (newValue, oldValue) => {

						// Check is changed
						if(!angular.equals(newValue, oldValue)) {
							$scope.helper.isModelChanged = 
									!angular.equals(newValue, $scope.helper.userProperties);
							$scope.$applyAsync();
						}
					}, true);
				},

				// Reset
				reset: () => {

					// Check form active
					switch($scope.helper.modelFormKey) {

						// Profile
						case 'profile':
							$scope.model.profile = util.objMerge({}, $scope.helper.userProperties);
							$scope.helper.isInEditMode 		= false;
							$scope.helper.isModelChanged 	= false;
							$scope.$applyAsync();
							break;

						// Password/Email
						default:
							$scope.helper.isInEditMode = false;
							Object.keys($scope.model[$scope.helper.modelFormKey]).forEach(key => {
								$scope.model[$scope.helper.modelFormKey][key] = null;
							});
							$scope.$applyAsync();
					}
				}
			}

			// Set scope methods
			$scope.methods = {

				// Modify
				modify: () => {
					$scope.helper.isInEditMode = true;
					$scope.$applyAsync();
					form.focus();
				},

				// Cancel
				cancel: () => {

					// Check form active
					if ($scope.helper.modelFormKey === 'profile') {

						// Check model changed
						if ($scope.helper.isModelChanged) {
							
							// Confirm
							msg.show({
								icon      : "text-primary fa-solid fa-circle-question",
								content   : "Az módosított adatokat elveti?",
								isConfirm	: true,
								callback  : (response) => {
									if (response === 'ok') {
										methods.reset();
									}
								}
							});
						} else methods.reset();
					} else methods.reset();
				},

				// Go to prevent enabled state
				preventState: () => trans.preventState(),

				// Accept
				accept: () => {

					// Confirm
					msg.show({
						icon      : "text-primary fa-solid fa-circle-question",
						content   : "Az adatait módosítja?",
						isConfirm	: true,
						callback  : (response) => {
							if (response === 'ok') {
								
								// Set variable
								let filter, data;

								// Check form active
								switch($scope.helper.modelFormKey) {

									// Profile
									case 'profile':

										// Set filter and data
										filter 	= ["type","rank","ranking","email","typeName","rankName"];
										data 		= util.objFilterByKeys($scope.model.profile, filter, false);
					
										// Convert/Set argumants
										if (util.isObjectHasKey(data, 'born') && util.isDate(data.born))
											data.born = moment(data.born).format('YYYY-MM-DD');

										// Change user properties
										http.request({
											url: './php/setUserProperties.php',
											data: data
										})
										.then(response => {
											$scope.helper.isInEditMode 			= false;
											$scope.helper.isModelChanged 		= false;
											$rootScope.isUserDataCompleted 	= true;
											$scope.helper.userProperties 		= 
															util.objMerge({}, $scope.model.profile);
											$scope.$applyAsync();

											msg.show({
												icon		: "text-success fa-solid fa-circle-check",
												title 	: "Profil",
												content	: response
											});
										})
										.catch(e => {
											msg.show({
												icon		: "text-danger fa-solid fa-circle-exclamation",
												title 	: "Hiba",
												content	: e
											});
											$scope.methods.cancel();
										});
										break;

									// Passord
									case 'password':

										// Set filter and data
										filter 	= ["password_current","password_confirm","show_password"],
										data 		= util.objFilterByKeys($scope.model.password, filter, false);
										data.id = $rootScope.user.id;

										// Change password
										http.request({
											url: './php/changePassword.php',
											data: data
										})
										.then(response => {
											
											$scope.helper.currentPassword = data.password;
											methods.reset();

											msg.show({
												icon		: "text-success fa-solid fa-circle-check",
												title 	: "Profil",
												content	: response
											});
										})
										.catch(e => {
											msg.show({
												icon		: "text-danger fa-solid fa-circle-exclamation",
												title 	: "Hiba",
												content	: e
											});
											$scope.methods.cancel();
										});
										break;

									// Email
									case 'email':

										// Set filter and data
										filter 	= ["email_current","email_confirm",
															 "password_current","show_password"],
										data 		= util.objFilterByKeys($scope.model.email, filter, false);
										data.id = $rootScope.user.id;

										// Change password
										http.request({
											url: './php/changeEmail.php',
											data: data
										})
										.then(response => {
											
											$scope.helper.currentEmail = data.email;
											methods.reset();

											msg.show({
												icon		: "text-success fa-solid fa-circle-check",
												title 	: "Profil",
												content	: response
											});
										})
										.catch(e => {
											msg.show({
												icon		: "text-danger fa-solid fa-circle-exclamation",
												title 	: "Hiba",
												content	: e
											});
											$scope.methods.cancel();
										});
										break;
								}
							}
						}
					});
				},

				formChange: (key) => {
					$scope.helper.modelFormKey = key;
					$scope.$applyAsync();
				}
			}

			// Initialize
			methods.init();
		}
	])

	// Tables controller
	.controller('tablesController', [
		'$stateParams',
    '$scope',
		'http',
		'msg',
		'util',
		'trans',
		'user',
    function($stateParams, $scope, http, msg, util, trans, user) {

			// Set local methods
			let methods = {

				// Initialize
				init: () => {

					// Check state parameters
					if (!util.isObjectHasKey($stateParams, 'url') || !$stateParams.url ||
							!util.isObjectHasKey($stateParams, 'str') || !$stateParams.str) {
						trans.preventState();
						return;
					}

					// Get data and structure
					Promise.all([
						methods.getData(), 
						methods.getStr()])
					.then(() => {
						methods.set();
					});
				},

				// Get data
				getData: () => {
					let data = null;
					if ($stateParams.type === 'user')
						data = util.objFilterByKeys(user.get(),
														'id;type;rank;superior', true);
					return new Promise((resolve) => {
						http.request({
							url: `./php/${$stateParams.url}.php`,
							data: data
						})
						.then(response => {
							$scope.data = response;
							resolve();
						})
						.catch(e => methods.error(e));
					});
				},

				// Get structure
				getStr: () => {
					return new Promise((resolve) => {
						http.request(`./str/${$stateParams.str}.json`)
						.then(response => {
							$scope.str = response;
							resolve();
						})
						.catch(e => methods.error(e));
					});
				},

				// Set
				set: () => {

					// Set structure default properties
					$scope.str = util.objMerge({
						tables    : [],
						tblPointer: -1
					}, $scope.str);

					// Set tables default properties
					$scope.str.tables.forEach((tbl, i) => {
						tbl.cellsLength = Object.keys(tbl.header).length;
						tbl.rowPointer  = -1;
						tbl.tblIndex    = i;
						if (!util.isObjectHasKey(tbl, 'title') || 
								!util.isString(tbl.title))
							tbl.title = null; 
						if (!util.isObjectHasKey(tbl, 'header') || 
								!util.isObject(tbl.header))
							tbl.header = {};
						if (!util.isObjectHasKey(tbl, 'style') || 
								!util.isArray(tbl.style))
							tbl.style = [];
						tbl.style = tbl.style.length ? tbl.style.join(',') : null;
						if (tbl.style)
							tbl.style = `{${tbl.style}}`;
					});
	
					// Check first table has data
					if (util.isArray($scope.data) && $scope.data.length) {
						$scope.str.tblPointer = 0;
						if (util.isArray($scope.data[$scope.str.tblPointer]) &&
								$scope.data[$scope.str.tblPointer].length) {
							$scope.str.tables[$scope.str.tblPointer].rowPointer = 0;
							let str = $scope.str.tables.filter(o => 
												o.relationship && o.relationship.parentIndex === 
												$scope.str.tblPointer);
							if (str.length) methods.relationship(str);
						}
					}

					// Apply change
					$scope.$applyAsync();
					
				},

				// Relationship
				relationship: (str) => {
					for(let i=0; i < str.length; i++) {
						let k = str[i].relationship.currentKey,
								v = $scope.data[str[i].relationship.parentIndex]
															[$scope.str.tables[str[i].relationship.parentIndex].rowPointer]
															[str[i].relationship.parentKey],
								index = $scope.data[str[i].tblIndex].findIndex(o => o[k] === v);
						if (index !== $scope.str.tables[str[i].tblIndex].rowPointer) {
							$scope.str.tables[str[i].tblIndex].rowPointer = index;
							let next = $scope.str.tables.filter(o => 
												o.relationship && o.relationship.parentIndex === str[i].tblIndex);
							if (next.length) {
								if (index !== -1)
											methods.relationship(next);
								else  next.forEach((o) => o.rowPointer = index);
							}
						}  
					}
				},

				// Show error
				error: (e) => {
					msg.show({
						icon		: "text-danger fa-solid fa-circle-exclamation",
						title 	: "HIBA",
						content	: e
					});
				}
			};

			// Set scope methods
			$scope.methods = {

				// Change table pointer
				changeTblPointer: function(tblPointer) {
					if (tblPointer !== $scope.str.tblPointer) {
						$scope.str.tblPointer = tblPointer;
						$scope.$applyAsync();
					}
				},

				// Change table row pointer
				changeRowPointer: function(tblPointer, rowPointer) {
					if (tblPointer === $scope.str.tblPointer &&
							$scope.str.tables[tblPointer].rowPointer !== rowPointer) {
						$scope.str.tables[tblPointer].rowPointer = rowPointer;
						let str = $scope.str.tables.filter(o => 
												o.relationship && o.relationship.parentIndex === tblPointer);
						if (str.length) methods.relationship(str);
						$scope.$applyAsync();
					}
				}
			};

			// Initialize
			methods.init();
		}
	])

	// Header navigation for tables controller
	.controller('headerNav2Controller', [
		'$scope',
		'trans',
		function($scope, trans) {
			$scope.close = () => trans.preventState();
		}
	])

	// Scroll to top directive
  .directive('ngScrollToTop', [
    () => {
      return {
				restrict: 'EA',
				replace: true,
				scope: {},
				template:`<div class="scroll-to-top-icon position-absolute cursor-pointer
															rounded-circle bg-white btnClickEffect">
		 								<i class="text-color-base fa-4x fa-circle-up fa-solid"></i>
	 								</div>`,
        link: (scope, iElement) => {
          iElement[0].addEventListener('click', () => {
						let pageConteiner = document.querySelector('.page-container');
        		if (pageConteiner && pageConteiner.scrollTop)  {
          		pageConteiner.scrollTo({
            		top: 0, 
            		left: 0, 
            		behavior: 'smooth'
          		});
						}
					});
        }
      };
  }]);

})(window, angular);