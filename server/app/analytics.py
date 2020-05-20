import logging

import requests

_GA_TRACKING_URL = 'https://www.google-analytics.com/collect'
logger = logging.getLogger()


class GA(object):
    def __init__(self, tracker_id):
        self.tracker_id = tracker_id
    
    def _collect(self, params, headers=None):
        params = self._sanitize(params)
        logger.info('Invoking ga with params %s', params)
        return requests.post(_GA_TRACKING_URL, data=params, headers=headers)

    def _sanitize(self, params):
        return {k: v for k, v in params.iteritems() if v}
    
    def _add_default(self, params):
        params.update({
            'v': '1',
            'tid': self.tracker_id,
            # defaulting data source to web by default.
            'ds': 'web',
        })
    
    def _add_extra(self, params, **kwargs):
        params.update(kwargs)
    
    def _ip(self, params, ip_address):
        params['uip'] = ip_address

    def event(
        self, 
        event_category,
        event_action=None,
        event_label=None,
        event_value=None,
        headers=None,
        ip_address=None,
        **kwargs):

        params = {
            't': 'event',
            'ec': event_category,
            'ea': event_action,
            'el': event_label,
            'ev': event_value,
        }

        self._add_default(params)
        self._ip(params, ip_address)
        self._add_extra(params, **kwargs)
        return self._collect(params, headers=headers)
