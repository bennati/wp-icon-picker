/**
 * wp.media.model.IconPickerFonts
 */
var IconPickerFonts = Backbone.Collection.extend({
	initialize: function( models ) {
		this.items = new Backbone.Collection( models );
		this.props = new Backbone.Model({
			group:  'all',
			search: ''
		});

		this.props.on( 'change', this.refresh, this );
	},

	/**
	 * Refresh library when props is changed
	 *
	 * @param {Backbone.Model} props
	 */
	refresh: function( props ) {
		var library = this,
		    items   = this.items.toJSON();

		_.each( props.toJSON(), function( value, filter ) {
			if ( library.filters[ filter ]) {
				items = _.filter( items, _.bind( library.filters[ filter ], this ), value );
			}
		}, this );

		this.reset( items );
	},
	filters: {
		/**
		 * @static
		 * @param {object} item
		 *
		 * @this wp.media.model.IconPickerFonts
		 *
		 * @returns {Boolean}
		 */
		group: function( item ) {
			var groupId = this.props.get( 'group' );

			return (  groupId === 'all' || item.group === groupId || item.group === '' );
		},

		/**
		 * @static
		 * @param {object} item
		 *
		 * @this wp.media.model.IconPickerFonts
		 *
		 * @returns {Boolean}
		 */
		search: function( item ) {
			var term = this.props.get( 'search' ),
			    result;

			if ( term === '' ) {
				result = true;
			} else {
				result = _.any([ 'id', 'name' ], function( key ) {
					var value = item[ key ];

					return value && value.search( this ) >= 0;
				}, term );
			}

			return result;
		}
	}
});

module.exports = IconPickerFonts;
